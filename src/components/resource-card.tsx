
import type { Resource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, HelpCircle, Download, Eye } from "lucide-react";

type ResourceCardProps = {
  resource: Resource;
  onPreview: (url: string) => void;
};

const iconMap = {
    PDF: <FileText className="h-8 w-8 text-accent" />,
    Worksheet: <ClipboardList className="h-8 w-8 text-accent" />,
    Quiz: <HelpCircle className="h-8 w-8 text-accent" />
}

export default function ResourceCard({ resource, onPreview }: ResourceCardProps) {
  
  const getPreviewUrl = (url: string) => {
    const downloadRegex = /https:\/\/drive\.google\.com\/uc\?export=download&id=([a-zA-Z0-9_-]+)/;
    const match = url.match(downloadRegex);
    if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // For non-Google Drive links or already previewable links, return as is.
    // This works for most PDFs hosted elsewhere.
    return url;
  }

  return (
    <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border-t-4 border-t-accent rounded-lg">
        <CardHeader className="flex flex-row items-center gap-4">
            {iconMap[resource.type]}
            <div>
                <CardTitle className="font-headline text-lg text-primary">{resource.title}</CardTitle>
                <CardDescription>{resource.type}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
            <p className="text-foreground/80 text-sm mb-4 flex-grow">{resource.description}</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full" onClick={() => onPreview(getPreviewUrl(resource.fileUrl))}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                </Button>
                <Button asChild className="w-full">
                    <a href={resource.fileUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </a>
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
