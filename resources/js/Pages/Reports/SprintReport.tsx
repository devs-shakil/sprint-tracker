import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Printer, Download, CheckCircle2, Calendar, Folder } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface Segment {
    id: number;
    name: string;
    tasks: Task[];
}

interface Sprint {
    id: number;
    sprint_number: number;
    start_date: string;
    end_date: string;
    completed_at?: string;
}

interface Project {
    id: number;
    name: string;
}

interface Props {
    project: Project;
    sprint?: Sprint;
    segments: Segment[];
    type: 'sprint' | 'project';
}

export default function SprintReport({ project, sprint, segments, type }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const reportTitle = type === 'sprint' 
        ? `Sprint ${sprint?.sprint_number} Report` 
        : `Monthly Project Report - ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center print:hidden">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Report Preview
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`${project.name} - ${reportTitle}`} />

            <div className="my-4 bg-muted/30 min-h-screen print:bg-white print:py-0">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 print:max-w-none print:px-0">
                    <Card className="border-none shadow-sm
                     print:shadow-none overflow-hidden bg-background py-0">
                        {/* Report Header */}
                        <div className="bg-primary/5 border-b px-4 py-4 ">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-primary font-bold text-sm uppercase  ">Project Report</div>
                                    <h1 className="text-xl capitalize font-extrabold text-foreground ">{project.name}</h1>
                                    <h2 className="text-base font-bold text-muted-foreground">{reportTitle}</h2>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-foreground mb-1">Generated On</div>
                                    <div className="text-muted-foreground flex items-center justify-end gap-2">
                                        <Calendar className="h-4 w-4" /> {today}
                                    </div>
                                    {sprint && (
                                        <div className="mt-4">
                                            <Badge variant="outline" className="border-primary/20 text-primary font-bold px-3 py-1">
                                                Sprint Duration: {sprint.start_date} - {sprint.end_date}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-8 space-y-10 print:p-6 print:space-y-8">
                            {/* Summary Intro */}
                            {/* <div className="bg-muted/30 rounded-xl p-6 border border-border/50 italic text-muted-foreground text-lg leading-relaxed">
                                This report summarizes the successfully completed tasks and achievements within the current {type === 'sprint' ? 'sprint cycle' : 'project period'}. 
                                All items listed below have been verified and meet our quality standards.
                            </div> */}

                            {/* Report Body */}
                            <div className="space-y-6">
                                {segments.filter(s => s.tasks.length > 0).map((segment) => (
                                    <div key={segment.id} className="space-y-2">
                                        <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-2">
                                            <div className="p-1 bg-primary/10 rounded-lg">
                                                <Folder className="h-4 w-4 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground">
                                                {segment.name}
                                            </h3>
                                            <Badge variant="secondary" className="ml-auto">
                                                {segment.tasks.length} Completed
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {segment.tasks.map((task) => (
                                                <div 
                                                    key={task.id} 
                                                    className="flex items-start gap-4 p-1 hover:bg-muted/50 transition-colors rounded-xl border border-border/20 bg-muted/10 group"
                                                >
                                                    <div className="mt-1">
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500/10 group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <div className="text-lg font-medium text-foreground leading-tight">
                                                        {task.title}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {segments.every(s => s.tasks.length === 0) && (
                                    <div className="text-center py-4 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                                        <div className="text-muted-foreground text-xl">No completed tasks found for this period.</div>
                                    </div>
                                )}
                            </div>

                            {/* Report Footer */}
                            {/* <div className="mt-20 pt-10 border-t border-border/50 text-center text-muted-foreground">
                                <p className="font-bold text-foreground mb-2">Confidence Score: High</p>
                                <p className="text-sm">This is an automated report generated by the Sprint Management System.</p>
                                <p className="text-sm mt-1">© {new Date().getFullYear()} {project.name} Management</p>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body {
                        background: white !important;
                    }
                    .py-12 {
                        padding: 0 !important;
                    }
                    .max-w-4xl {
                        max-width: none !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .shadow-xl {
                        box-shadow: none !important;
                    }
                    .border-none {
                        border: none !important;
                    }
                    .bg-muted/30 {
                        background-color: #f9fafb !important;
                    }
                    .rounded-xl {
                        border-radius: 0.5rem !important;
                    }
                    nav, button, .print\\:hidden {
                        display: none !important;
                    }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
