import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, Users, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApplications, mockInternships } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export function MentorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleStatusChange = (applicationId: string, status: "approved" | "rejected") => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? {
              ...app, 
              status,
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewedBy: user?.name || "Mentor",
              notes: notes[applicationId] || ""
            }
          : app
      )
    );

    toast({
      title: status === "approved" ? "Application Approved" : "Application Rejected",
      description: `Student has been notified of the decision.`,
      className: status === "approved" ? "bg-secondary text-secondary-foreground" : "",
    });

    // Clear the notes for this application
    setNotes(prev => ({ ...prev, [applicationId]: "" }));
  };

  const pendingApplications = applications.filter(app => app.status === "pending");
  const reviewedApplications = applications.filter(app => app.status !== "pending");

  const stats = {
    total: applications.length,
    pending: pendingApplications.length,
    approved: applications.filter(app => app.status === "approved").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome, {user?.name} • {user?.department}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Total Applications</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-status-pending to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-destructive-foreground/80">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive-foreground/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Applications */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Pending Applications ({stats.pending})
            </h2>
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No pending applications to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pendingApplications.map((application) => {
                  const internship = mockInternships.find(i => i.id === application.internshipId);
                  return (
                    <Card key={application.id} className="border-l-4 border-l-status-pending">
                      <CardHeader>
                        <CardTitle className="text-lg">{application.studentName}</CardTitle>
                        <CardDescription>
                          Applied for: {internship?.title} at {internship?.company}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-sm text-muted-foreground">
                            <p>Email: {application.studentEmail}</p>
                            <p>Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>
                          </div>

                          {internship && (
                            <div>
                              <p className="text-sm font-medium mb-2">Required Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {internship.requirements.map((skill, index) => (
                                  <Badge key={index} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Review Notes (Optional)
                            </label>
                            <Textarea
                              placeholder="Add any notes about this application..."
                              value={notes[application.id] || ""}
                              onChange={(e) => setNotes(prev => ({
                                ...prev,
                                [application.id]: e.target.value
                              }))}
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleStatusChange(application.id, "approved")}
                              className="flex-1"
                              variant="default"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(application.id, "rejected")}
                              className="flex-1"
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviewed Applications */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Reviewed Applications ({reviewedApplications.length})
            </h2>
            {reviewedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No applications reviewed yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviewedApplications.map((application) => {
                  const internship = mockInternships.find(i => i.id === application.internshipId);
                  return (
                    <Card key={application.id} className={`border-l-4 ${
                      application.status === 'approved' 
                        ? 'border-l-secondary' 
                        : 'border-l-destructive'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{application.studentName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {internship?.title} at {internship?.company}
                            </p>
                          </div>
                          <StatusBadge status={application.status} />
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          <p>Applied: {new Date(application.appliedAt).toLocaleDateString()}</p>
                          <p>Reviewed: {new Date(application.reviewedAt!).toLocaleDateString()}</p>
                        </div>
                        
                        {application.notes && (
                          <>
                            <Separator className="my-3" />
                            <div className="text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Review Notes:</span>
                              </div>
                              <p className="text-muted-foreground">{application.notes}</p>
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