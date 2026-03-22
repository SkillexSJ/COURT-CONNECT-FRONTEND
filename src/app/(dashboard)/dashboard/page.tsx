/***
 * NODE PACKAGES
 */
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
/**
 * SERVICES
 */
// import { getStudentDashboardStats } from "@/service/user.service";
// import { getAllBookings } from "@/service/booking.service";

/**
 * COMPONENTS
 */
// import { StudentDashboardContent } from "./student-dashboard-content";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";

/**
 * LIBS
 */
import { requireUser } from "@/lib/session";

export default async function UserDashboardPage() {
  const user = await requireUser();
  const cookieStore = await cookies();
  // for tutor onboarding
  const intendedRole = cookieStore.get("intended_role")?.value;

  //   if (intendedRole === "tutor") {
  //     redirect("/onboarding/tutor");
  //   }

  //   // route protection
  //   if (user.role === "tutor") {
  //     redirect("/tutor");
  //   }

  //   if (user.role === "admin") {
  //     redirect("/admin");
  //   }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {/* <DashboardDataWrapper /> */}
      <div>User Dashboard</div>
    </Suspense>
  );
}

// async function DashboardDataWrapper() {
//   const headersList = await headers();
//   const fetchOptions = {
//     headers: {
//       Cookie: headersList.get("cookie") || "",
//     },
//   };

//   try {
//     // const [statsRes, bookingsRes] = await Promise.all([
//     //   getStudentDashboardStats(fetchOptions),
//     //   getAllBookings({ limit: 100 }, fetchOptions),
//     // ]);

//     if (!statsRes.success) {
//       return (
//         <div className="p-8 text-center">
//           <h2 className="text-xl font-semibold text-red-600">
//             Failed to load statistics
//           </h2>
//           <p className="text-muted-foreground">{statsRes.message}</p>
//         </div>
//       );
//     }

//     const recentBookings = bookingsRes.success ? bookingsRes.data : [];

//     return (
//     //   <StudentDashboardContent
//     //     stats={statsRes.data}
//     //     recentBookings={recentBookings}
//     //   />
//     <div>s</div>
//     );
//   } catch (error: any) {
//     console.error("Error fetching student dashboard data:", error);
//     return (
//       <div className="p-8 text-center">
//         <h2 className="text-xl font-semibold text-red-600">
//           Something went wrong
//         </h2>
//         <p className="text-muted-foreground">
//           We couldn't load your dashboard. Please try refreshing the page.
//         </p>
//       </div>
//     );
//   }
// }
