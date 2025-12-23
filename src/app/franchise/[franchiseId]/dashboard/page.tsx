
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LogOut, MoreHorizontal, CheckCircle, XCircle, FileText, UserCheck, Star, Award, Search, Eye } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import type { ExamRegistration, ExamResult, Review, Franchise } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { signOut } from 'firebase/auth';
import { useRouter, useParams, notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy, where, Timestamp, getDoc } from "firebase/firestore";
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type DashboardData = {
    registrations: ExamRegistration[];
    results: ExamResult[];
    reviews: Review[];
}

export default function FranchiseDashboardPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    const router = useRouter();
    const params = useParams();
    const franchiseId = params.franchiseId as string;

    const [franchise, setFranchise] = useState<Franchise | null>(null);
    const [data, setData] = useState<DashboardData>({ registrations: [], results: [], reviews: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

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

                // 2. Fetch Franchise Details
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
                // Reviews are not tied to a franchise, so we'll fetch approved ones for display
                const reviewsQuery = query(collection(firestore, "reviews"), where("isApproved", "==", true), orderBy("submittedAt", "desc"));

                const [regSnap, resultsSnap, reviewsSnap] = await Promise.all([
                    getDocs(regQuery),
                    getDocs(resultsQuery),
                    getDocs(reviewsQuery)
                ]);

                const registrationList = regSnap.docs.map(doc => {
                    const data = doc.data();
                    const registeredAt = (data.registeredAt as Timestamp)?.toDate().toLocaleString() || new Date().toLocaleString();
                    return { id: doc.id, ...data, registeredAt, isRead: data.isRead || false } as ExamRegistration;
                });

                const resultList = resultsSnap.docs.map(doc => {
                    const data = doc.data();
                    const submittedAt = (data.submittedAt as Timestamp)?.toDate().toLocaleString() || new Date().toLocaleString();
                    return { id: doc.id, ...data, submittedAt } as ExamResult;
                });
                
                const reviewList = reviewsSnap.docs.map(doc => {
                    const data = doc.data();
                    const submittedAt = (data.submittedAt as Timestamp)?.toDate().toLocaleString() || new Date().toLocaleString();
                    return { id: doc.id, ...data, submittedAt } as Review;
                });
                
                setData({ registrations: registrationList, results: resultList, reviews: reviewList });

            } catch (error) {
                console.error("Error fetching franchise data:", error);
                toast({ title: "Error", description: "Could not fetch dashboard data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        authorizeAndFetch();

    }, [user, isUserLoading, router, firestore, franchiseId, toast]);

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


    const unreadRegistrations = data.registrations.filter(r => !r.isRead).length;

    const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) => {
        const statusConfig = {
            'Approved': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return (
            <Badge
                className={cn('text-xs font-semibold', statusConfig[status])}
                variant="outline"
            >
                {status}
            </Badge>
        );
    };

    const filteredRegistrations = data.registrations.filter(reg => 
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        reg.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : data.registrations.length}</div>
                            <p className="text-xs text-muted-foreground">students registered in your franchise</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : unreadRegistrations}</div>
                            <p className="text-xs text-muted-foreground">new applications to review</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Exams Taken</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : data.results.length}</div>
                            <p className="text-xs text-muted-foreground">exams completed by your students</p>
                        </CardContent>
                    </Card>
                </div>
                <Tabs defaultValue="registrations">
                    <TabsList>
                        <TabsTrigger value="registrations">
                            Student Registrations {unreadRegistrations > 0 && <Badge className="ml-2">{unreadRegistrations}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="results">Exam Results</TabsTrigger>
                    </TabsList>
                    <TabsContent value="registrations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Registrations</CardTitle>
                                <CardDescription>Manage and approve new student applications for your franchise.</CardDescription>
                                 <div className="relative mt-4">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search students by name or reg. no..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? <p>Loading registrations...</p> : (
                                <ScrollArea className="w-full whitespace-nowrap">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Reg. No</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Course</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden md:table-cell">Registered</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredRegistrations.map(reg => (
                                                <TableRow key={reg.id} onClick={() => !reg.isRead && handleMarkAsRead(reg.id)} className={cn(!reg.isRead && "bg-blue-50 hover:bg-blue-100/80")}>
                                                    <TableCell className="font-mono">{reg.registrationNumber}</TableCell>
                                                    <TableCell className="font-medium flex items-center gap-2">
                                                        {!reg.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                                        {reg.fullName}
                                                    </TableCell>
                                                    <TableCell>{reg.course}</TableCell>
                                                    <TableCell><StatusBadge status={reg.status} /></TableCell>
                                                    <TableCell className="hidden md:table-cell">{reg.registeredAt}</TableCell>
                                                    <TableCell className="text-right">
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleRegistrationStatusChange(reg.id, 'Approved')}><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Approve</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleRegistrationStatusChange(reg.id, 'Rejected')}><XCircle className="mr-2 h-4 w-4 text-red-500" />Reject</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="results">
                        <Card>
                             <CardHeader>
                                <CardTitle>Exam Results</CardTitle>
                                <CardDescription>View results from exams taken by students in your franchise.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? <p>Loading results...</p> : (
                                    <ScrollArea className="w-full whitespace-nowrap">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Reg. No</TableHead>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Test Name</TableHead>
                                                    <TableHead>Score</TableHead>
                                                    <TableHead>Submitted</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.results.map(res => (
                                                    <TableRow key={res.id}>
                                                        <TableCell className="font-mono">{res.registrationNumber}</TableCell>
                                                        <TableCell className="font-medium">{res.studentName}</TableCell>
                                                        <TableCell>{res.testName}</TableCell>
                                                        <TableCell>{res.score}/{res.totalMarks}</TableCell>
                                                        <TableCell>{res.submittedAt}</TableCell>
                                                         <TableCell className="text-right">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/exam/result/${res.id}`}><Eye className="mr-2 h-4 w-4" />View Details</Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
