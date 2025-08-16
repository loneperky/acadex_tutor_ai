// app/settings/page.tsx or src/pages/settings.tsx
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Trash2,
  Bell,
  Settings,
  ArrowLeft,
  Phone,
  Shield,
  Link,
  LogOut,
  Lightbulb,
} from "lucide-react";


export default function SettingsPage() {
  const { user, logout, deleteAcc } = useAuth()
  return (
    <div className=" h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Account */}
        <section id="account" className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Account Info
          </h3>
          <div className="space-y-2">
            <div>
              <button className="text-sm text-muted-foreground inline-flex items-center gap-2 p-2 rounded-lg">
                <User /> <span className="text-base">{user.full_name}</span>
              </button>
              <p className="text-sm text-muted-foreground flex gap-2">

              </p>
            </div>
            <div>
              <button className="text-sm text-muted-foreground inline-flex items-center gap-2 p-2 rounded-lg">
                <Mail className="h-4 w-5" /> <span className="text-base">{user.email}</span>
              </button>

            </div>
            <div>
              <button className="text-sm text-muted-foreground inline-flex items-center gap-2 p-2 rounded-lg">
                <Phone className="h-4 w-5" />
                <span className="text-base">{user.phone_number || "nill"}</span>
              </button>
              <p className="text-sm text-muted-foreground">


              </p>
            </div>

            <div>
              <button className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:bg-muted/50 p-2 rounded-lg">
                <Shield className="h-5 w-5" />
                <span className="text-base rounded-3xl">Upgrade to Pro</span>
              </button>

            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div id="security" className="">
            <button className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:bg-muted/50 p-2 rounded-lg">
              <Lock className="h-5 w-5" />
              <a href="change-password" className="text-sm text-muted-foreground">
                Change Password
              </a>
            </button>
          </div>

          <button onClick={logout} className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:bg-muted/50 p-2 rounded-lg">
            <h3 className="text-lg font-semibold  flex items-center gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Log out
            </h3>
          </button>

          <p className="text-sm text-muted-foreground">
            Log out of your account. You can log back in anytime.
          </p>
          <hr />
          <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground">Delete your account permanently. This action cannot be undone.</p>

          <button onClick={deleteAcc} className="text-red-100 px-2 py-1 text-sm bg-red-900 rounded-sm">Delete Account</button>

        </section>


        {/* Danger Zone */}
        <section id="danger" className="space-y-4">

        </section>
      </main>
    </div>
  );
}
