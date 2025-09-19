import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Building2, Clock, IndianRupee, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockInternships, mockApplications } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);

  const handleApply = (internshipId: string) => {
    const newApplication = {
      id: Date.now().toString(),
      internshipId,
      studentId: user?.id || "1",
      studentName: user?.name || "Student",
      studentEmail: user?.email || "student@example.com",
      status: "pending" as const,
      appliedAt: new Date().toISOString().split('T')[0],
    };

    setApplications(prev => [...prev, newApplication]);
    
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent for review.",
      className: "bg-secondary text-secondary-foreground",
    });
  };

  const isApplied = (internshipId: string) => {
    return applications.some(app => 
      app.internshipId === internshipId && app.studentId === user?.id
    );
  };

  const getApplicationStatus = (internshipId: string) => {
    const application = applications.find(app => 
      app.internshipId === internshipId && app.studentId === user?.id
    );
    return application?.status;
  };

  const studentApplications = applications.filter(app => app.studentId === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {user?.department} • Year {user?.year}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Available Internships</p>
                  <p className="text-3xl font-bold">{mockInternships.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80">Applications Sent</p>
                  <p className="text-3xl font-bold">{studentApplications.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-status-approved to-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Approved Applications</p>
                  <p className="text-3xl font-bold">
                    {studentApplications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Internships */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-6">Available Internships</h2>
            <div className="space-y-6">
              {mockInternships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-primary">{internship.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary-dark">
                          {internship.company}
                        </CardDescription>
                      </div>
                      {isApplied(internship.id) && (
                        <StatusBadge status={getApplicationStatus(internship.id)!} />
                      )}
                    </div>
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

                    <Button
                      onClick={() => handleApply(internship.id)}
                      disabled={isApplied(internship.id)}
                      className="w-full"
                    >
                      {isApplied(internship.id) ? "Already Applied" : "Apply Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Applications */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-6">My Applications</h2>
            {studentApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No applications yet. Start applying to internships!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {studentApplications.map((application) => {
                  const internship = mockInternships.find(i => i.id === application.internshipId);
                  return (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-primary">{internship?.title}</h3>
                            <p className="text-sm text-muted-foreground">{internship?.company}</p>
                          </div>
                          <StatusBadge status={application.status} />
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                        
                        {application.reviewedAt && (
                          <>
                            <Separator className="my-3" />
                            <div className="text-sm">
                              <p className="text-muted-foreground">
                                Reviewed on: {new Date(application.reviewedAt).toLocaleDateString()}
                              </p>
                              {application.notes && (
                                <p className="mt-2 text-foreground">{application.notes}</p>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}