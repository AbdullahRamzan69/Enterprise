# Requirements Document

## Introduction

This feature is a ground-up redesign of the existing Aethel EBMS dashboard. The current dashboard relies on a dense collection of statistic cards with little visual hierarchy, making it difficult for users to extract meaning quickly. The redesign replaces that layout with a clean, modern SaaS aesthetic — inspired by products like Linear, Stripe, Vercel, and Notion — so that users understand the company's status within 5 seconds of opening the application.

The redesign is purely a UI/layout change. All existing Redux business logic, slices, selectors, routing, and data models remain intact. The tech stack stays the same: React, TypeScript, Redux Toolkit, Recharts, Tailwind CSS, and shadcn/ui components.

## Glossary

- **Dashboard**: The primary landing page rendered at `/dashboard` via `DashboardHome.tsx`.
- **Header**: The sticky top navigation bar rendered by `Navbar.tsx`, spanning the full page width.
- **Sidebar**: The left-side navigation panel rendered by `Sidebar.tsx`.
- **KPI_Card**: A compact summary card displaying a single key performance indicator with an animated number, trend badge, icon, and label.
- **Attendance_Trend_Chart**: An area chart rendered with Recharts that shows daily present/absent counts over a selectable time window.
- **Department_Overview_Chart**: A donut chart rendered with Recharts that shows workforce distribution by department.
- **Activity_Feed**: A vertically scrolling timeline list showing the most recent system events in reverse-chronological order.
- **Quick_Actions_Panel**: A grid of shortcut buttons enabling single-click navigation to high-frequency workflows.
- **Events_Panel**: A list widget showing upcoming employee birthdays, company meetings, contract expirations, probation end dates, and public holidays.
- **Theme_Toggle**: A control in the Header that switches the application between light, dark, and system color schemes.
- **Count_Up_Animation**: A numeric animation effect where a displayed number increments from zero to its target value when the component first mounts.
- **Redux_Store**: The application-wide state container managed by Redux Toolkit, sourcing data for employees, attendance, leave, finance, and settings slices.
- **Recharts**: The charting library already installed in the project (`recharts ^3.9.0`) used for all dashboard charts.
- **Tailwind**: The utility-first CSS framework used for all styling (`tailwindcss ^4.3.1`).
- **shadcn_ui**: The component library (card, button, badge, avatar, input, dropdown, sheet, tabs) already installed and used in the project.

---

## Requirements

### Requirement 1: Layout Structure and Grid

**User Story:** As a user, I want the dashboard to present information in a clear, scannable layout, so that I can understand the company's status within 5 seconds of opening the application.

#### Acceptance Criteria

1. THE Dashboard SHALL render a full-page layout composed of a fixed-width Sidebar (256px) on the left, a sticky Header (64px tall) spanning the top, and a main content area occupying the remaining space.
2. THE Dashboard SHALL arrange the main content area in the following vertical order: KPI Cards row, Attendance Trend Chart, a two-column row containing the Activity Feed and the Department Overview Chart, and a two-column row containing the Quick Actions Panel and the Events Panel.
3. WHEN the viewport width is 1024px or greater, THE Dashboard SHALL render the KPI Cards section as a 4-column grid.
4. WHEN the viewport width is between 640px and 1023px inclusive, THE Dashboard SHALL render the KPI Cards section as a 2-column grid.
5. WHEN the viewport width is less than 640px, THE Dashboard SHALL render every section — including the KPI Cards row, the two-column Activity Feed / Department Overview row, and the two-column Quick Actions / Events row — as a single-column layout.
6. THE Dashboard SHALL apply a vertical gap of at least 24px between each major section.
7. THE Dashboard SHALL not render any inter-section vertical gap greater than 32px.
8. THE Dashboard SHALL use the `background` CSS design token for the page background color, which resolves to the light-mode background in light mode and the dark-mode background in dark mode.

---

### Requirement 2: Header

**User Story:** As a user, I want a consistent, sticky header with personalized greeting, search, and key controls, so that I can navigate and act without scrolling back to the top.

#### Acceptance Criteria

1. THE Header SHALL remain fixed at the top of the viewport and overlay the main content area as the user scrolls.
2. THE Header SHALL display a personalized greeting in the format "Good [Morning/Afternoon/Evening], [User Name]" where "Morning" applies when the local hour is 0–11, "Afternoon" when 12–17, and "Evening" when 18–23.
3. THE Header SHALL display the current date formatted as the full weekday, month, day, and year (e.g., "Monday, July 14, 2025").
4. THE Header SHALL render a search input field with a placeholder that includes the Ctrl+K keyboard shortcut hint and accepts keyboard input.
5. WHEN the user presses Ctrl+K, THE Header SHALL focus the search input field.
6. IF unread notifications exist, THEN THE Header SHALL display a badge on the notification bell icon showing the unread count, where counts exceeding 99 are displayed as "99+".
7. WHEN the notification bell is activated, THE Header SHALL display a dropdown panel listing up to 5 recent notifications, each showing a title, description, and relative timestamp.
8. WHEN the user avatar or display name is activated, THE Header SHALL open a profile dropdown.
9. THE Header SHALL render the Theme_Toggle control that allows the user to switch between light, dark, and system themes.
10. WHEN the viewport is smaller than the large breakpoint (1024px), THE Header SHALL render a hamburger menu button that opens the Sidebar as an overlay sheet.

---

### Requirement 3: KPI Cards

**User Story:** As a manager, I want to see the four most critical metrics at a glance, so that I can assess company health without drilling into sub-pages.

#### Acceptance Criteria

1. THE Dashboard SHALL render exactly four KPI_Cards in the following order: Total Employees, Attendance Today, Pending Leave Requests, and Payroll Status.
2. WHEN a KPI_Card mounts, THE KPI_Card SHALL animate the displayed number from zero to its target value using a Count_Up_Animation over a duration of 900 milliseconds.
3. THE KPI_Card for Total Employees SHALL derive its value by counting employees whose `status` field equals "Active" from the result of `selectEmployees` in the Redux_Store.
4. THE KPI_Card for Attendance Today SHALL derive its value from `selectAttendanceCountByDateAndStatus` using today's ISO date and status "Present".
5. THE KPI_Card for Pending Leave Requests SHALL derive its value from `selectLeaveCountByStatus` using status "Pending".
6. THE KPI_Card for Payroll Status SHALL derive its value from `selectPendingPaymentsCount` and display the count of payroll records with payment status "Pending".
7. EACH KPI_Card SHALL display an icon whose background color is unique among the four cards, a large bold number, a label of no more than 40 characters, and an optional comparison badge that indicates either a positive (upward arrow, green) or negative (downward arrow, red) direction.
8. WHEN the user hovers over a KPI_Card, THE KPI_Card SHALL increase its box shadow to `shadow-lg` and apply a −2px vertical translate transition over 300 milliseconds.
9. IF a KPI_Card value cannot be derived from the Redux_Store (e.g., empty state on first load), THEN THE KPI_Card SHALL display 0, remain fully rendered, and throw no runtime exception.

---

### Requirement 4: Attendance Trend Chart

**User Story:** As a manager, I want to view attendance patterns over configurable time windows, so that I can identify trends and anomalies quickly.

#### Acceptance Criteria

1. THE Attendance_Trend_Chart SHALL render an area chart using Recharts with two data series: "Present" (solid stroke) and "Absent" (dashed stroke).
2. THE Attendance_Trend_Chart SHALL support two filter options — Weekly (7 days) and Monthly (30 days) — rendered as a segmented button group.
3. WHEN the user selects a filter option, THE Attendance_Trend_Chart SHALL update the displayed data client-side to reflect the selected time window.
4. THE Attendance_Trend_Chart SHALL display a custom tooltip on hover that shows the date label and the Present and Absent values for that data point.
5. THE Attendance_Trend_Chart SHALL derive attendance data by aggregating attendance records from the Redux_Store grouped by date, mapping `AttendanceStatus` values "Present" to the Present series, and "Absent", "Late", and "Half Day" as contributors to the Absent series.
6. WHEN the chart first mounts, THE Attendance_Trend_Chart SHALL animate the area paths from left to right using Recharts' built-in animation.
7. THE Attendance_Trend_Chart SHALL include a legend row below the chart identifying the Present and Absent series by color.
8. THE Attendance_Trend_Chart SHALL render fully within a responsive container that adapts its width to the available content area.
9. WHEN no attendance records exist in the Redux_Store for the selected time window, THE Attendance_Trend_Chart SHALL display an empty-state message instead of a blank chart.

---

### Requirement 5: Department Overview Chart

**User Story:** As an HR manager, I want to see workforce distribution by department in a visual format, so that I can understand team balance at a glance.

#### Acceptance Criteria

1. THE Department_Overview_Chart SHALL render a donut chart using Recharts that shows each department as a proportional arc segment.
2. THE Department_Overview_Chart SHALL derive department counts by grouping employees from `selectEmployees` in the Redux_Store by their `department` field, counting only employees with status "Active".
3. EACH department segment SHALL be assigned a distinct accent color from a predefined palette; when the number of departments exceeds the palette size, colors SHALL cycle from the beginning of the palette.
4. WHEN the user hovers over a donut segment, THE Department_Overview_Chart SHALL display a tooltip showing the department name and employee count.
5. THE Department_Overview_Chart SHALL render a legend list beside or below the chart that maps each department name to its color and count.
6. IF no employees with status "Active" exist in the Redux_Store, THEN THE Department_Overview_Chart SHALL display an empty-state message instead of a blank chart.

---

### Requirement 6: Recent Activity Feed

**User Story:** As a user, I want to see a chronological list of recent system events, so that I can stay informed about changes without navigating to each module.

#### Acceptance Criteria

1. THE Activity_Feed SHALL display a list of recent events sorted in reverse-chronological order by `appliedAt` for leave events and by `date` for attendance and employee events (newest first).
2. EACH activity item SHALL display a user avatar or icon, an event description following the pattern "[Employee Name] [action verb]" (e.g., "Ahmed checked in"), a relative timestamp (e.g., "5 minutes ago"), and a color-coded status indicator.
3. THE Activity_Feed SHALL derive events from a combined view across leave requests, attendance records, and employee records sourced from the Redux_Store.
4. IF the Activity_Feed contains more than eight items, THEN THE Activity_Feed SHALL truncate the visible list to eight items and render a "View all" link that navigates to the relevant module.
5. THE Activity_Feed SHALL use status colors: the success color for approved or present events, the warning color for pending, late, or half-day events, and the danger color for rejected or absent events.
6. WHEN no events exist in the Redux_Store across all sourced slices, THE Activity_Feed SHALL display an empty-state message.

---

### Requirement 7: Quick Actions Panel

**User Story:** As an HR manager, I want single-click shortcuts to the most common workflows, so that I can start common tasks without navigating the sidebar.

#### Acceptance Criteria

1. THE Quick_Actions_Panel SHALL render exactly four shortcut buttons: "Add Employee", "Approve Leave", "Generate Payroll", and "View Reports".
2. WHEN the "Add Employee" button is activated via mouse click or keyboard (Enter or Space), THE Quick_Actions_Panel SHALL navigate to `/employees/new` via client-side routing without a full page reload.
3. WHEN the "Approve Leave" button is activated via mouse click or keyboard (Enter or Space), THE Quick_Actions_Panel SHALL navigate to `/leave` via client-side routing without a full page reload.
4. WHEN the "Generate Payroll" button is activated via mouse click or keyboard (Enter or Space), THE Quick_Actions_Panel SHALL navigate to `/finance/new` via client-side routing without a full page reload.
5. WHEN the "View Reports" button is activated via mouse click or keyboard (Enter or Space), THE Quick_Actions_Panel SHALL navigate to `/assets/reports` via client-side routing without a full page reload.
6. EACH shortcut button SHALL display a unique icon not shared with any other shortcut button, and a label of no more than 20 characters.
7. WHEN the user hovers over a shortcut button, THE Quick_Actions_Panel SHALL apply a visible background color change and scale the icon by 110% over 200 milliseconds.

---

### Requirement 8: Upcoming Events Panel

**User Story:** As a user, I want to see upcoming dates and deadlines consolidated in one place, so that I can plan ahead without checking multiple modules.

#### Acceptance Criteria

1. THE Events_Panel SHALL display upcoming events — occurring from today up to 30 days in the future — of the following types: Employee Birthdays, Project Deadlines (sourced from project `endDate`), Contract Expirations, Probation End Dates, and Public Holidays.
2. EACH event item SHALL display a type-specific icon, the event title, the event date, and a relative time label: "Today" if the event date equals today, "in 1 day" if one day away, or "in N days" for N ≥ 2.
3. THE Events_Panel SHALL sort events in ascending order by date (soonest first).
4. WHEN an event is due within 7 days (and not today), THE Events_Panel SHALL render the relative time label with the warning color.
5. WHEN an event is due today, THE Events_Panel SHALL render the relative time label with the danger color.
6. THE Events_Panel SHALL derive employee birthday dates from the `dateOfBirth` field on the Employee record; contract expiration dates as exactly 1 year after `joiningDate` for employees whose `employmentType` is "Contract"; and probation end dates as exactly 3 months after `joiningDate` for employees whose `employmentType` is "Full-time" or "Part-time".
7. WHEN no upcoming events exist within the next 30 days, THE Events_Panel SHALL display an empty-state message.

---

### Requirement 9: Visual Design and Theming

**User Story:** As a user, I want the dashboard to feel premium and professional, so that I trust the application and find it enjoyable to use.

#### Acceptance Criteria

1. THE Dashboard SHALL use the `card` CSS design token for card backgrounds, with soft box shadows, rounded corners of at least 12px, and minimal border strokes using the `border` CSS design token.
2. THE Dashboard SHALL apply the primary color token exclusively to interactive elements, active states, chart series, and icon accents — not to static backgrounds or non-interactive text.
3. THE Dashboard SHALL reserve semantic color tokens for status meaning: the success token for positive outcomes, the warning token for advisory states, and the danger/destructive token for errors or critical states.
4. THE Dashboard SHALL use a typography scale where KPI numbers are rendered at `text-3xl font-bold`, section headings at `text-base font-semibold`, and secondary labels at `text-sm` using the muted foreground color token.
5. THE Dashboard SHALL support dark mode by inheriting the existing Tailwind CSS dark mode tokens already defined in the project, with no hardcoded color values that only apply to one mode.
6. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL transition all color values that change between themes smoothly over 200 milliseconds using CSS transitions.

---

### Requirement 10: Animation and Interaction

**User Story:** As a user, I want subtle animations that confirm my interactions and make the page feel alive, so that the application feels responsive and polished.

#### Acceptance Criteria

1. WHEN the Dashboard page first renders, THE Dashboard SHALL stagger-fade the following major sections into view — KPI row, Attendance Trend Chart, Recent Activity, Department Overview, Quick Actions, and Upcoming Events — using a CSS animation that starts each section at opacity 0 and translateY 20px, with a 50–150 millisecond staggered delay between sections.
2. WHEN a KPI_Card mounts, THE KPI_Card SHALL execute the Count_Up_Animation starting after a configurable delay between 0 and 500 milliseconds to support staggered entrance, running for 900 milliseconds.
3. WHEN chart components mount, THE Attendance_Trend_Chart SHALL animate its area paths with `isAnimationActive={true}` and an `animationDuration` of 800 milliseconds; THE Department_Overview_Chart SHALL animate its segments with `isAnimationActive={true}` and an `animationDuration` of 800 milliseconds.
4. WHEN the user hovers over any interactive card or button, THE Dashboard SHALL respond with a box-shadow increase of at least one level and/or a translateY shift of −2px to −4px, completing the transition within 200–300 milliseconds using CSS transitions.
5. THE Dashboard SHALL not display layout shift or flickering during the animation sequence, meaning no element's opacity decreases after its entrance animation begins and no element shifts its layout position outside its reserved space.

---

### Requirement 11: Accessibility

**User Story:** As a user with assistive technology, I want the dashboard to be fully navigable by keyboard and screen reader, so that I can use all features without a mouse.

#### Acceptance Criteria

1. THE Dashboard SHALL assign an `aria-label` attribute to all icon-only buttons — including the notification bell, theme toggle, and hamburger menu — where the label names the button's action or purpose, is non-empty, and is unique among all icon-only buttons on the page.
2. THE Dashboard SHALL use semantic HTML elements: `<header>` for the Header, `<aside>` for the Sidebar, `<main>` for the main content area, and `<section>` or `<article>` for each dashboard panel.
3. WHEN a KPI_Card value is animated via Count_Up_Animation, THE KPI_Card SHALL expose the final static value to screen readers via `aria-label` rather than the intermediate animated value.
4. WHEN a keyboard user moves focus to an interactive element, THE Dashboard SHALL display a visible focus ring with a contrast ratio of at least 3:1 between focused and unfocused states, covering a minimum 2 CSS pixel outline area.
5. THE Dashboard SHALL maintain a minimum text contrast ratio of 4.5:1 for all body text and 3:1 for large headings (defined as text ≥ 18pt at normal weight or ≥ 14pt at bold weight) relative to their backgrounds, in both light and dark modes.
6. WHEN the user moves keyboard focus to a chart area and presses Enter or Space, THE Dashboard SHALL activate the chart tooltip; WHEN the user presses Escape, THE Dashboard SHALL dismiss the tooltip; and the tooltip content SHALL be readable by screen readers via `aria-describedby` on the triggering element.
7. WHEN the Activity_Feed receives new events, THE Dashboard SHALL announce the update to screen readers using an element with `aria-live="polite"`, without interrupting ongoing announcements.

---

### Requirement 12: Responsiveness

**User Story:** As a user on a tablet or mobile device, I want the dashboard to adapt its layout gracefully, so that all key information is accessible on any screen size.

#### Acceptance Criteria

1. WHEN the viewport width is less than 1024px, THE Sidebar SHALL be hidden from the default layout and accessible only via the hamburger menu button in the Header.
2. WHEN the hamburger menu is activated on a viewport narrower than 1024px, THE Sidebar SHALL slide in as an overlay sheet from the left side.
3. WHEN the user activates the close button, taps outside the overlay, or navigates to a link while the Sidebar overlay is open, THE Sidebar overlay SHALL close.
4. WHEN the viewport width is less than 640px, THE two-column rows (Activity Feed / Department Overview, Quick Actions / Events) SHALL collapse to single-column stacked layout.
5. THE Dashboard SHALL maintain a minimum of 16px internal card padding on all viewport sizes.
6. WHEN the viewport width is less than 640px, THE Header greeting and date text SHALL be hidden to preserve horizontal space for the search, notifications, and user profile controls.
7. THE Dashboard SHALL support viewport widths as narrow as 320px without horizontal overflow or content clipping.

---

### Requirement 13: Component Reusability

**User Story:** As a developer, I want all dashboard UI elements built as isolated, typed React components, so that they can be maintained and extended independently.

#### Acceptance Criteria

1. THE Dashboard SHALL implement each panel as a separate TypeScript React component file within `src/components/dashboard/`: `KPICard.tsx`, `AttendanceTrend.tsx`, `DepartmentOverview.tsx`, `RecentActivity.tsx`, `QuickActions.tsx`, and `UpcomingEvents.tsx`.
2. EACH component SHALL define explicit TypeScript prop interfaces or type aliases for all inputs, with no use of `any` type; components that accept no props SHALL declare an explicit empty interface or include a comment documenting that the component is intentionally prop-free.
3. THE KPI_Card component SHALL accept `icon`, `label`, `value`, `iconBg`, `iconColor`, `change`, `changePositive`, `description`, `suffix`, and `delay` as typed props.
4. THE Attendance_Trend_Chart component SHALL accept `data7d`, `data30d`, and `totalEmployees` as typed props, where `data7d` and `data30d` are arrays of `{ day: string; present: number; absent: number }` objects containing between 1 and 365 elements.
5. THE Dashboard SHALL not introduce any new third-party npm dependencies beyond those already present in `package.json`.
