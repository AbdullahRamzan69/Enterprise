import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  History,
  KeyRound,
  Mail,
  Phone,
  Shield,
  Trash2,
  UserMinus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/settings/admin/ConfirmationDialog";
import { MockToast } from "@/components/settings/admin/MockToast";
import { UserFormDialog } from "@/components/settings/admin/UserFormDialog";
import { AdminStatusBadge } from "@/components/settings/admin/AdminStatusBadge";
import {
  deactivateAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/features/settings/settingsSlice";
import {
  selectAdminUserById,
  selectDepartments,
  selectRoleById,
  selectRoles,
} from "@/features/settings/settingsSelectors";
import {
  formatAdminDate,
  getAdminInitials,
} from "@/features/settings/settingsAdminUtils";

export default function SettingsUserDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) =>
    id ? selectAdminUserById(state, id) : undefined,
  );
  const roles = useAppSelector(selectRoles);
  const departments = useAppSelector(selectDepartments);
  const role = useAppSelector((state) =>
    user ? selectRoleById(state, user.roleId) : undefined,
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const severityClasses = useMemo(
    () => ({
      info: "bg-blue-500/10 text-blue-500",
      success: "bg-emerald-500/10 text-emerald-500",
      warning: "bg-amber-500/10 text-amber-500",
      danger: "bg-red-500/10 text-red-500",
    }),
    [],
  );

  if (!user) {
    return (
      <div className="space-y-6 text-center py-12 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">User Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a user record for this request.
          </p>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/settings/users">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 rounded-lg border-border/80"
          >
            <Link to="/settings/users">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">User Details</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Profile, permissions summary, and recent access activity for{" "}
              {user.fullName}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setEditOpen(true)}
            className="rounded-lg text-xs"
          >
            Edit User
          </Button>
          <Button
            variant="outline"
            onClick={() => setResetOpen(true)}
            className="rounded-lg text-xs"
          >
            <KeyRound className="w-4 h-4 mr-1.5" />
            Reset Password
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeactivateOpen(true)}
            className="rounded-lg text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <UserMinus className="w-4 h-4 mr-1.5" />
            Deactivate
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg text-xs"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border/60 shadow-sm">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getAdminInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {user.fullName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {user.designation} • {user.department}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px] rounded-full px-2.5 py-1"
                  >
                    {user.employeeId}
                  </Badge>
                  <AdminStatusBadge status={user.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Role" value={role?.name ?? "Unassigned"} />
              <Detail
                label="Email"
                value={user.email}
                icon={<Mail className="w-4 h-4 text-primary" />}
              />
              <Detail
                label="Phone"
                value={user.phone}
                icon={<Phone className="w-4 h-4 text-primary" />}
              />
              <Detail label="Department" value={user.department} />
              <Detail label="Designation" value={user.designation} />
              <Detail
                label="Last Login"
                value={formatAdminDate(user.lastLogin)}
              />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Activity Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Most recent administrative and access events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.activityTimeline.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${severityClasses[item.severity]}`}
                    >
                      <History className="w-4 h-4" />
                    </div>
                    {index < user.activityTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatAdminDate(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Permissions Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user.permissionsSummary.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Assigned Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {user.assignedModules.map((module) => (
                <Badge
                  key={module}
                  variant="outline"
                  className="rounded-full px-2.5 py-1 bg-muted/20"
                >
                  {module}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Recent Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {user.recentActions.map((action) => (
                <div
                  key={action}
                  className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-muted-foreground"
                >
                  {action}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <UserFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initialUser={user}
        departments={departments.map((department) => department.name)}
        roles={roles}
        onSubmit={(values) => {
          dispatch(updateAdminUser({ ...user, ...values }));
          setEditOpen(false);
          setToastMessage("User details updated.");
        }}
      />

      <ConfirmationDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset Password"
        description={`Send a password reset prompt for ${user.fullName}?`}
        confirmLabel="Reset Password"
        onConfirm={() => {
          setResetOpen(false);
          setToastMessage("Password reset prompt sent.");
        }}
      />

      <ConfirmationDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${user.fullName}?`}
        confirmLabel="Deactivate"
        destructive
        onConfirm={() => {
          dispatch(deactivateAdminUser(user.id));
          setDeactivateOpen(false);
          setToastMessage("User account deactivated.");
        }}
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description={`Delete ${user.fullName}'s account? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          dispatch(deleteAdminUser(user.id));
          setDeleteOpen(false);
          setToastMessage("User account deleted.");
        }}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground flex items-center gap-2">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
