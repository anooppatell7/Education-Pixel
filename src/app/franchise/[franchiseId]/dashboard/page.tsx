
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LogOut, MoreHorizontal, CheckCircle, XCircle, FileText, UserCheck, Star, Award, Search, Eye, PlusCircle, BookCopy, ListTodo, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import type { ExamRegistration, ExamResult, Review, Franchise, TestCategory, MockTest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { signOut } from 'firebase/auth';
import { useRouter, useParams, notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy, where, Timestamp, getDoc, addDoc, serverTimestamp, writeBatch, deleteDoc } from "firebase/firestore";
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type DashboardData = {
    registrations: ExamRegistration[];
    results: ExamResult[];
    reviews: Review[];
    testCategories: TestCategory[];
    mockTests: MockTest[];
}

export default function FranchiseDashboardPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    const router = useRouter();
    const params = useParams();
    const franchiseId = params.franchiseId as string;

    const [franchise, setFranchise] = useState<Franchise | null>(null);
    const [data, setData] = useState<DashboardData>({ registrations: [], results: [], reviews: [], testCategories: [], mockTests: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('registrations');

    // Form and Dialog states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [formParentIds, setFormParentIds] = useState<{ testId?: string } | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string, parentIds?: { testId?: string } } | null>(null);

    // Authorize and Fetch Data
    useEffect(() => {
        if (isUserLoading) return;
        if (!user || !firestore) {
            router.push('/login');
            return;
        }

        const authorizeAndFetch = async () => {
            setLoading(true);
            try {
                // 1. Verify user role and franchise ownership
                const userDocRef = doc(firestore, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists() || userDocSnap.data().role !== 'franchiseAdmin' || userDocSnap.data().franchiseId !== franchiseId) {
                    toast({ title: "Access Denied", description: "You are not authorized to view this dashboard.", variant: "destructive" });
                    router.push('/login');
                    return;
                }
                const franchiseDocRef = doc(firestore, "franchises", franchiseId);
                const franchiseDocSnap = await getDoc(franchiseDocRef);
                if (franchiseDocSnap.exists()) {
                    setFranchise({ id: franchiseDocSnap.id, ...franchiseDocSnap.data() } as Franchise);
                } else {
                     notFound();
                }

                // 3. Fetch franchise-specific data
                const regQuery = query(collection(firestore, "examRegistrations"), where("franchiseId", "==", franchiseId), orderBy("registeredAt", "desc"));
                const resultsQuery = query(collection(firestore, "examResults"), where("franchiseId", "==", franchiseId), orderBy("submittedAt", "desc"));
                const categoriesQuery = query(collection(firestore, "testCategories"), where("franchiseId", "==", franchiseId));
                const mockTestsQuery = query(collection(firestore, "mockTests"), where("franchiseId", "==", franchiseId));

                const [regSnap, resultsSnap, categoriesSnap, mockTestsSnap] = await Promise.all([
                    getDocs(regQuery),
                    getDocs(resultsQuery),
                    getDocs(categoriesQuery),
                    getDocs(mockTestsQuery)
                ]);

                const registrationList = regSnap.docs.map(d => ({ id: d.id, ...d.data(), registeredAt: (d.data().registeredAt as Timestamp)?.toDate().toLocaleString() || '' } as ExamRegistration));
                const resultList = resultsSnap.docs.map(d => ({ id: d.id, ...d.data(), submittedAt: (d.data().submittedAt as Timestamp)?.toDate().toLocaleString() || '' } as ExamResult));
                const categoriesList = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as TestCategory));
                const mockTestsList = mockTestsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MockTest));
                
                setData({ registrations: registrationList, results: resultList, testCategories: categoriesList, mockTests: mockTestsList, reviews: [] });

            } catch (error) {
                console.error("Error fetching franchise data:", error);
                 if (error instanceof Error && error.message.includes('permission-denied') || error.message.includes('insufficient permissions')) {
                    const permissionError = new FirestorePermissionError({
                        path: `franchise-dashboard/${franchiseId}`,
                        operation: 'list',
                    } satisfies SecurityRuleContext);
                    errorEmitter.emit('permission-error', permissionError);
                } else {
                    toast({ title: "Error", description: "Could not fetch dashboard data.", variant: "destructive" });
                }
            } finally {
                setLoading(false);
            }
        };

        authorizeAndFetch();

    }, [user, isUserLoading, router, firestore, franchiseId, toast]);

    // ... (rest of the functions: handleMarkAsRead, handleRegistrationStatusChange, etc.)
    const handleMarkAsRead = (id: string) => {
        if (!firestore) return;
        const docRef = doc(firestore, "examRegistrations", id);
        updateDoc(docRef, { isRead: true }).then(() => {
            setData(prev => ({
                ...prev,
                registrations: prev.registrations.map(item => item.id === id ? { ...item, isRead: true } : item)
            }));
        }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: { isRead: true } });
            errorEmitter.emit('permission-error', permissionError);
        });
    };
    
     const handleRegistrationStatusChange = (registrationId: string, status: 'Approved' | 'Rejected') => {
        if (!firestore) return;
        const regRef = doc(firestore, "examRegistrations", registrationId);
        const data = { 
            isApproved: status === 'Approved',
            status: status
        };

        updateDoc(regRef, data).then(() => {
            setData(prev => ({
                 ...prev,
                registrations: prev.registrations.map(reg => 
                reg.id === registrationId ? { ...reg, ...data } : reg
            )}));
            toast({ title: "Success", description: `Registration has been ${status}.` });
        }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({ path: regRef.path, operation: 'update', requestResourceData: data });
            errorEmitter.emit('permission-error', permissionError);
        });
    };

    const handleAddNew = (parentIds: { testId?: string } | null = null) => {
        setEditingItem(null);
        let initialData: any = {};
        if (activeTab === 'mock-tests' && parentIds?.testId) {
            setFormParentIds(parentIds);
        } else {
            setFormParentIds(null);
        }
        setFormData(initialData);
        setIsFormOpen(true);
    };

    const handleEdit = (item: any, parentIds: { testId?: string } | null = null) => {
        setEditingItem(item);
        setFormData(item);
        if (parentIds) {
            setFormParentIds(parentIds);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        setFormData({});
        setFormParentIds(null);
    }
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if ((e.target as HTMLInputElement).type === 'checkbox') {
             setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
             return;
        }
        if (name.startsWith('option')) { // For test question options
            const index = parseInt(name.split('-')[1]);
            const newOptions = [...(formData.options || ['', '', '', ''])];
            newOptions[index] = value;
            setFormData({ ...formData, options: newOptions });
        } else if (type === 'number') {
             setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const createSlug = (title: string) => {
      if (!title) return '';
      return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;

        let collectionName: 'testCategories' | 'mockTests' | null = null;
        let dataToSave = { ...formData, franchiseId };
        let docId = editingItem?.id;

        delete dataToSave.id;

        switch (activeTab) {
            case 'test-categories':
                collectionName = 'testCategories';
                docId = editingItem?.id || createSlug(dataToSave.title);
                if (!docId) { toast({ title: "Error", description: "Category must have a title.", variant: "destructive" }); return; }
                dataToSave.id = docId;
                break;
            case 'mock-tests':
                if (formParentIds?.testId) { // Editing/Adding a question
                    const testRef = doc(firestore, "mockTests", formParentIds.testId);
                    const testDoc = await getDoc(testRef);
                    if (testDoc.exists()) {
                        const testData = testDoc.data() as MockTest;
                        let updatedQuestions;
                        if (editingItem) { // Editing question
                            updatedQuestions = testData.questions.map(q => q.id === editingItem.id ? { ...dataToSave, id: editingItem.id } : q);
                        } else { // Adding new question
                            const newQuestion = { ...dataToSave, id: doc(collection(firestore, 'mock-tests')).id };
                            updatedQuestions = [...(testData.questions || []), newQuestion];
                        }
                        await updateDoc(testRef, { questions: updatedQuestions });
                        toast({ title: "Success", description: "Question saved." });
                        authorizeAndFetch(); handleCloseForm();
                    }
                    return;
                } else { // Editing/Adding a test
                    collectionName = 'mockTests';
                    if (!editingItem) dataToSave.questions = [];
                    const category = data.testCategories.find(c => c.id === dataToSave.categoryId);
                    dataToSave.categoryName = category?.title || '';
                }
                break;
        }

        if (!collectionName) return;

        if (editingItem) { // Update
            const docRef = doc(firestore, collectionName, docId);
            await updateDoc(docRef, dataToSave);
        } else { // Create
            if (activeTab === 'test-categories') {
                await setDoc(doc(firestore, collectionName, docId), dataToSave);
            } else {
                await addDoc(collection(firestore, collectionName), dataToSave);
            }
        }

        toast({ title: "Success", description: "Data saved successfully." });
        authorizeAndFetch();
        handleCloseForm();
    };
    
    const openConfirmationDialog = (type: string, id: string, parentIds?: { testId?: string }) => {
        setItemToDelete({ type, id, parentIds });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!firestore || !itemToDelete) return;
        const { type, id, parentIds } = itemToDelete;
    
        try {
            if (type === 'testQuestion' && parentIds?.testId) {
                const testRef = doc(firestore, "mockTests", parentIds.testId);
                const testDoc = await getDoc(testRef);
                if (testDoc.exists()) {
                    const testData = testDoc.data() as MockTest;
                    const updatedQuestions = testData.questions.filter(q => q.id !== id);
                    await updateDoc(testRef, { questions: updatedQuestions });
                }
            } else if (type === 'mockTest') {
                await deleteDoc(doc(firestore, "mockTests", id));
            } else if (type === 'testCategory') {
                await deleteDoc(doc(firestore, "testCategories", id));
            }
            toast({ title: "Success", description: "Item deleted." });
            authorizeAndFetch();
        } catch (error) {
            console.error("Delete error:", error);
            toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
        } finally {
            setDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const getFormTitle = () => {
        const isEditing = !!editingItem;
        if (activeTab === 'test-categories') return isEditing ? 'Edit Test Category' : 'Add New Category';
        if (activeTab === 'mock-tests') {
            if (formParentIds?.testId) return isEditing ? 'Edit Question' : 'Add New Question';
            return isEditing ? 'Edit Mock Test' : 'Add New Mock Test';
        }
        return 'Manage Item';
    };

    const renderFormFields = () => {
        let currentForm = activeTab;
        if (activeTab === 'mock-tests' && formParentIds?.testId) {
            currentForm = 'testQuestion';
        }

        switch(currentForm) {
             case 'test-categories': return (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="id">Category ID (Slug)</Label>
                        <Input id="id" name="id" value={formData.id || ''} onChange={handleFormChange} disabled={!!editingItem} placeholder="e.g., ms-word-tests"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title || ''} onChange={handleFormChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description || ''} onChange={handleFormChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon (Emoji)</Label>
                        <Input id="icon" name="icon" value={formData.icon || ''} onChange={handleFormChange} placeholder="e.g., 📄"/>
                    </div>
                </>
            );
            case 'mock-tests': return (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Test Title</Label>
                        <Input id="title" name="title" value={formData.title || ''} onChange={handleFormChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select name="categoryId" value={formData.categoryId || ''} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                             <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                             <SelectContent>
                                {data.testCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                                ))}
                             </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description || ''} onChange={handleFormChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (Minutes)</Label>
                            <Input id="duration" name="duration" type="number" value={formData.duration || 0} onChange={handleFormChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="totalMarks">Total Marks</Label>
                            <Input id="totalMarks" name="totalMarks" type="number" value={formData.totalMarks || 0} onChange={handleFormChange} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="isPublished" name="isPublished" checked={formData.isPublished || false} onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})} />
                        <Label htmlFor="isPublished">Publish Test</Label>
                    </div>
                </>
            );
             case 'testQuestion': return (
                 <>
                    <div className="grid gap-2">
                        <Label htmlFor="questionText">Question Text</Label>
                        <Textarea id="questionText" name="questionText" value={formData.questionText || ''} onChange={handleFormChange} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="option-0">Option A</Label><Input id="option-0" name="option-0" value={formData.options?.[0] || ''} onChange={handleFormChange} /></div>
                        <div className="grid gap-2"><Label htmlFor="option-1">Option B</Label><Input id="option-1" name="option-1" value={formData.options?.[1] || ''} onChange={handleFormChange} /></div>
                        <div className="grid gap-2"><Label htmlFor="option-2">Option C</Label><Input id="option-2" name="option-2" value={formData.options?.[2] || ''} onChange={handleFormChange} /></div>
                        <div className="grid gap-2"><Label htmlFor="option-3">Option D</Label><Input id="option-3" name="option-3" value={formData.options?.[3] || ''} onChange={handleFormChange} /></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="correctOption">Correct Option</Label>
                            <Select name="correctOption" value={String(formData.correctOption) || '0'} onValueChange={(val) => setFormData({ ...formData, correctOption: Number(val) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Option A</SelectItem><SelectItem value="1">Option B</SelectItem><SelectItem value="2">Option C</SelectItem><SelectItem value="3">Option D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2"><Label htmlFor="marks">Marks</Label><Input id="marks" name="marks" type="number" value={formData.marks || 1} onChange={handleFormChange} /></div>
                    </div>
                    <div className="grid gap-2"><Label htmlFor="explanation">Explanation (Optional)</Label><Textarea id="explanation" name="explanation" value={formData.explanation || ''} onChange={handleFormChange} /></div>
                </>
            );
            default: return null;
        }
    }


    const unreadRegistrations = data.registrations.filter(r => !r.isRead).length;

    const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) => {
        const statusConfig = {
            'Approved': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return <Badge className={cn('text-xs font-semibold', statusConfig[status])} variant="outline">{status}</Badge>;
    };

    const filteredRegistrations = data.registrations.filter(reg => 
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        reg.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const authorizeAndFetch = async () => { /* re-fetch logic from useEffect */ };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <Logo />
                <div className="ml-auto flex items-center gap-4">
                     <div className="text-right">
                        <p className="text-sm font-semibold">{franchise?.name || 'Franchise Dashboard'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => auth && signOut(auth)}>
                        <LogOut className="h-4 w-4" /><span className="sr-only">Logout</span>
                    </Button>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : data.registrations.length}</div><p className="text-xs text-muted-foreground">students registered in your franchise</p></CardContent></Card>
                     <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Registrations</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : unreadRegistrations}</div><p className="text-xs text-muted-foreground">new applications to review</p></CardContent></Card>
                     <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Exams Taken</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : data.results.length}</div><p className="text-xs text-muted-foreground">exams completed by your students</p></CardContent></Card>
                     <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Your Mock Tests</CardTitle><ListTodo className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{loading ? '...' : data.mockTests.length}</div><p className="text-xs text-muted-foreground">tests created by you</p></CardContent></Card>
                </div>
                <Tabs defaultValue="registrations" onValueChange={setActiveTab}>
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="registrations">Student Registrations {unreadRegistrations > 0 && <Badge className="ml-2">{unreadRegistrations}</Badge>}</TabsTrigger>
                            <TabsTrigger value="results">Exam Results</TabsTrigger>
                            <TabsTrigger value="test-categories">Test Categories</TabsTrigger>
                            <TabsTrigger value="mock-tests">Mock Tests</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2 pl-4">
                            {['test-categories', 'mock-tests'].includes(activeTab) && (
                                <Button size="sm" className="h-8 gap-1" onClick={() => handleAddNew()}>
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <TabsContent value="registrations">
                        <Card><CardHeader><CardTitle>Student Registrations</CardTitle><CardDescription>Manage and approve new student applications for your franchise.</CardDescription><div className="relative mt-4"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students by name or reg. no..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></CardHeader>
                            <CardContent>{loading ? <p>Loading registrations...</p> : (<ScrollArea className="w-full whitespace-nowrap"><Table><TableHeader><TableRow><TableHead>Reg. No</TableHead><TableHead>Name</TableHead><TableHead>Course</TableHead><TableHead>Status</TableHead><TableHead>Phone</TableHead><TableHead className="hidden md:table-cell">Registered</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
                                {filteredRegistrations.map(reg => (<TableRow key={reg.id} onClick={() => !reg.isRead && handleMarkAsRead(reg.id)} className={cn(!reg.isRead && "bg-blue-50 hover:bg-blue-100/80")}>
                                    <TableCell className="font-mono">{reg.registrationNumber}</TableCell><TableCell className="font-medium flex items-center gap-2">{!reg.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}{reg.fullName}</TableCell><TableCell>{reg.course}</TableCell><TableCell><StatusBadge status={reg.status} /></TableCell><TableCell>{reg.phone}</TableCell><TableCell className="hidden md:table-cell">{reg.registeredAt}</TableCell>
                                    <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleRegistrationStatusChange(reg.id, 'Approved')}><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Approve</DropdownMenuItem><DropdownMenuItem onClick={() => handleRegistrationStatusChange(reg.id, 'Rejected')}><XCircle className="mr-2 h-4 w-4 text-red-500" />Reject</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
                                </TableRow>))}
                            </TableBody></Table><ScrollBar orientation="horizontal" /></ScrollArea>)}</CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="results">
                        <Card><CardHeader><CardTitle>Exam Results</CardTitle><CardDescription>View results from exams taken by students in your franchise.</CardDescription></CardHeader>
                            <CardContent>{loading ? <p>Loading results...</p> : (<ScrollArea className="w-full whitespace-nowrap"><Table><TableHeader><TableRow><TableHead>Reg. No</TableHead><TableHead>Student Name</TableHead><TableHead>Test Name</TableHead><TableHead>Score</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
                                {data.results.map(res => (<TableRow key={res.id}><TableCell className="font-mono">{res.registrationNumber}</TableCell><TableCell className="font-medium">{res.studentName}</TableCell><TableCell>{res.testName}</TableCell><TableCell>{res.score}/{res.totalMarks}</TableCell><TableCell>{res.submittedAt}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm" asChild><Link href={`/exam/result/${res.id}`}><Eye className="mr-2 h-4 w-4" />View Details</Link></Button></TableCell></TableRow>))}
                            </TableBody></Table><ScrollBar orientation="horizontal" /></ScrollArea>)}</CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="test-categories">
                        <Card><CardHeader><CardTitle>Test Categories</CardTitle><CardDescription>Manage categories for your franchise's mock tests.</CardDescription></CardHeader>
                            <CardContent>{loading ? <p>Loading...</p> : (<Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>ID (Slug)</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
                                {data.testCategories.map(category => (<TableRow key={category.id}><TableCell className="font-medium flex items-center gap-2">{category.icon && <span className="text-xl">{category.icon}</span>}{category.title}</TableCell><TableCell>{category.id}</TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleEdit(category)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => openConfirmationDialog('testCategory', category.id)}><Trash className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}
                            </TableBody></Table>)}</CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="mock-tests">
                        <Card><CardHeader><CardTitle>Mock Tests</CardTitle><CardDescription>Create and manage mock tests for your franchise.</CardDescription></CardHeader>
                            <CardContent>{loading ? <p>Loading...</p> : (<Accordion type="multiple" className="w-full">
                                {data.mockTests.map(test => (<AccordionItem value={test.id} key={test.id} className="rounded-lg mb-2 border bg-card"><div className="flex items-center pr-4 hover:bg-muted/50 rounded-t-lg">
                                    <AccordionTrigger className="flex-1 px-4 py-2 hover:no-underline"><div className="flex items-center justify-between w-full"><div><span className="font-semibold text-lg">{test.title}</span><Badge variant="outline" className="ml-2">{test.categoryName || 'Uncategorized'}</Badge></div><div className="flex items-center gap-4 text-sm text-muted-foreground"><span>{test.questions?.length || 0} Questions</span><span>{test.duration} mins</span><Badge variant={test.isPublished ? "default" : "secondary"}>{test.isPublished ? "Published" : "Draft"}</Badge></div></div></AccordionTrigger>
                                    <div className="flex items-center gap-2 pl-2"><Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(test) }}><Edit className="h-4 w-4 mr-1" /> Edit Test</Button><Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); openConfirmationDialog('mockTest', test.id) }}><Trash className="h-4 w-4 mr-1" /> Delete</Button></div>
                                </div><AccordionContent className="pl-6 border-l-2 ml-3"><div className="py-4"><h4 className="font-semibold mb-4">Questions</h4><div className="space-y-2">
                                    {test.questions?.map((q, index) => (<div key={q.id} className="flex justify-between items-center p-3 rounded-md border bg-background"><p className="flex-1 truncate">{index + 1}. {q.questionText}</p><div className="flex items-center gap-2 ml-4"><Button variant="ghost" size="sm" onClick={() => handleEdit(q, { testId: test.id })}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" className="text-destructive" onClick={() => openConfirmationDialog('testQuestion', q.id, { testId: test.id })}><Trash className="h-4 w-4" /></Button></div></div>))}
                                    {(!test.questions || test.questions.length === 0) && (<p className="text-muted-foreground text-sm text-center py-4">No questions added yet.</p>)}
                                </div><Button variant="secondary" size="sm" className="mt-4" onClick={() => handleAddNew({ testId: test.id })}><PlusCircle className="h-4 w-4 mr-2" /> Add Question</Button></div></AccordionContent></AccordionItem>))}
                            </Accordion>)}</CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
             <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone and will permanently delete this item.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
            <Dialog open={isFormOpen} onOpenChange={handleCloseForm}><DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{getFormTitle()}</DialogTitle><DialogDescription>Fill in the details below. Click save when you're done.</DialogDescription></DialogHeader><form onSubmit={handleFormSubmit}><div className="grid gap-4 py-4">{renderFormFields()}</div><DialogFooter><Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button><Button type="submit">Save changes</Button></DialogFooter></form></DialogContent></Dialog>
        </div>
    );
}
