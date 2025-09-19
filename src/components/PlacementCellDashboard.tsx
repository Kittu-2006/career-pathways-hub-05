import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, Users, Calendar, IndianRupee, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockInternships, mockApplications } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { Internship } from "@/types/internship";

export function PlacementCellDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [internships, setInternships] = useState(mockInternships);
  const [applications] = useState(mockApplications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state for new internship
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    stipend: "",
    duration: "",
    location: "",
    deadline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInternship: Internship = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements: formData.requirements.split(",").map(r => r.trim()),
      stipend: parseInt(formData.stipend),
      duration: formData.duration,
      location: formData.location,
      deadline: formData.deadline,
      postedBy: user?.name || "Placement Cell",
      postedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    setInternships(prev => [newInternship, ...prev]);
    
    // Reset form
    setFormData({
      title: "",
      company: "",
      description: "",
      requirements: "",
      stipend: "",
      duration: "",
      location: "",
      deadline: "",
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Internship Posted Successfully!",
      description: "Students can now view and apply for this internship.",
      className: "bg-secondary text-secondary-foreground",
    });
  };

  const getInternshipApplications = (internshipId: string) => {
    return applications.filter(app => app.internshipId === internshipId);
  };

  const stats = {
    totalInternships: internships.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === "pending").length,
    approvedApplications: applications.filter(app => app.status === "approved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Placement Cell Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name} • Manage internships and applications
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Post New Internship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Internship</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new internship posting.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Frontend Development Intern"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g., TechCorp Solutions"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the internship role and responsibilities..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Required Skills (comma-separated)</Label>
                  <Input
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="e.g., React.js, JavaScript, HTML/CSS, Git"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stipend">Monthly Stipend (₹)</Label>
                    <Input
                      id="stipend"
                      type="number"
                      value={formData.stipend}
                      onChange={(e) => handleInputChange("stipend", e.target.value)}
                      placeholder="e.g., 15000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 6 months"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Bangalore"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Internship</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Total Internships</p>
                  <p className="text-3xl font-bold">{stats.totalInternships}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80">Total Applications</p>
                  <p className="text-3xl font-bold">{stats.totalApplications}</p>
                </div>
                <Users className="h-8 w-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-status-pending to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Pending Reviews</p>
                  <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                </div>
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-status-approved to-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Approved</p>
                  <p className="text-3xl font-bold">{stats.approvedApplications}</p>
                </div>
                <Users className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="internships" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internships">Posted Internships</TabsTrigger>
            <TabsTrigger value="applications">All Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="internships" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {internships.map((internship) => {
                const internshipApplications = getInternshipApplications(internship.id);
                return (
                  <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">{internship.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary-dark">
                        {internship.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{internship.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee className="h-4 w-4 text-secondary" />
                          <span>₹{internship.stipend.toLocaleString()}/month</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span>{internship.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span>{internship.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>Due: {new Date(internship.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.requirements.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-accent/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Applications Received:</span>
                          <Badge variant="outline" className="ml-2">
                            {internshipApplications.length} applications
                          </Badge>
                        </div>
                        {internshipApplications.length > 0 && (
                          <div className="mt-2 flex gap-2 text-xs">
                            <span className="text-status-pending">
                              {internshipApplications.filter(a => a.status === 'pending').length} pending
                            </span>
                            <span className="text-status-approved">
                              {internshipApplications.filter(a => a.status === 'approved').length} approved
                            </span>
                            <span className="text-status-rejected">
                              {internshipApplications.filter(a => a.status === 'rejected').length} rejected
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <div className="space-y-4">
              {applications.map((application) => {
                const internship = internships.find(i => i.id === application.internshipId);
                return (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{application.studentName}</h3>
                          <p className="text-muted-foreground">{application.studentEmail}</p>
                          <p className="text-sm text-primary font-medium">
                            Applied for: {internship?.title} at {internship?.company}
                          </p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>Applied: {new Date(application.appliedAt).toLocaleDateString()}</div>
                        {application.reviewedAt && (
                          <div>Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}</div>
                        )}
                      </div>
                      
                      {application.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Mentor Notes:</p>
                          <p className="text-sm text-muted-foreground">{application.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}