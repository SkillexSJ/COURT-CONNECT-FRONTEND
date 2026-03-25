import UserDashboardOverview from "@/components/features/dashboard/user/UserDashboardOverview";

export default function UserDashboardPage() {
  return <UserDashboardOverview />;
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
