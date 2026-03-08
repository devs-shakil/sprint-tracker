import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Plus, Trash2, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

export default function Create() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        segments: ['App', 'Web', 'Admin API'],
    });

    const addSegment = () => {
        setData('segments', [...data.segments, '']);
    };

    const removeSegment = (index: number) => {
        const newSegments = [...data.segments];
        newSegments.splice(index, 1);
        setData('segments', newSegments);
    };

    const handleSegmentChange = (index: number, value: string) => {
        const newSegments = [...data.segments];
        newSegments[index] = value;
        setData('segments', newSegments);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Link href={route('projects.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Create New Project
                    </h2>
                </div>
            }
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>
                                Step {step} of 2: {step === 1 ? 'Basic Information' : 'Project Segments'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Project Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. Ecommerce Store"
                                                className="mt-1"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="start_date">Start Date</Label>
                                                <Input
                                                    id="start_date"
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) => setData('start_date', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                                <InputError message={errors.start_date} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="end_date">End Date</Label>
                                                <Input
                                                    id="end_date"
                                                    type="date"
                                                    value={data.end_date}
                                                    onChange={(e) => setData('end_date', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                                <InputError message={errors.end_date} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button type="button" onClick={() => setStep(2)}>
                                                Next: Segments <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="text-sm font-medium">Segments / Teams</div>
                                        <p className="text-sm text-muted-foreground">
                                            Define the different areas of work for this project.
                                        </p>
                                        
                                        <div className="space-y-3">
                                            {data.segments.map((segment, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input
                                                        value={segment}
                                                        onChange={(e) => handleSegmentChange(index, e.target.value)}
                                                        placeholder={`Segment ${index + 1}`}
                                                        required
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => removeSegment(index)}
                                                        disabled={data.segments.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Button type="button" variant="outline" size="sm" onClick={addSegment} className="mt-2">
                                            <Plus className="mr-2 h-4 w-4" /> Add Segment
                                        </Button>

                                        <div className="flex justify-between pt-6 border-t">
                                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                <Save className="mr-2 h-4 w-4" /> Create Project
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
