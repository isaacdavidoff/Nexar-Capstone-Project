import "./dashboard.css";

export default function Dashboard() {

	const deadlines = [];
	return (
		<div className="page">

			<header className="header">

				<div className="logoWrap">
					<div className="logoBox">🎓</div>
					<h1 className="logoText">Nexar</h1>
				</div>

				<nav className="nav">
					<span className="activeNav">pooping</span>
					<span className="navItem">Courses</span>
					<span className="navItem">Focus</span>
					<span className="navItem">Reports</span>
				</nav>

				<div className="profileWrap">
					<button className="avatar">JD</button>
					<div>
						<div className="profileName">Jane Doe</div>
						<div className="profileRole">Student</div>
					</div>
				</div>

			</header>

			<main className="container">

				<div className="topBar">
					<button className="addButton">+ Add Task</button>
					<div className="weekBox">Feb 19 - Feb 25, 2026</div>
				</div>

				<div className="grid">

					<div>

						<section className="card">
							<div className="cardTitleRow">
								<h2 className="cardTitle">Weekly Schedule</h2>
								<span className="smallMuted">Feb 19 - Feb 25, 2026</span>
							</div>

							
							<div className="schedulePlaceholder">
								No tasks scheduled yet
							</div>

						</section>


						<section className="card">
							<div className="cardTitleRow">
								<h2 className="cardTitle">Weekly Workload</h2>
								<span className="smallMuted">0 tasks</span>
							</div>

							<p className="workloadText">0% of weekly capacity scheduled</p>

							<div className="progressBarBg">
								<div className="progressBarFill"></div>
							</div>

							<div className="statsRow">
								<div>
									<div className="statLabel">Due Today</div>
									<div className="statValue red">0</div>
								</div>

								<div>
									<div className="statLabel">This Week</div>
									<div className="statValue orange">0</div>
								</div>

								<div>
									<div className="statLabel">Upcoming</div>
									<div className="statValue green">0</div>
								</div>
							</div>

						</section>

					</div>


					<div>

						<section className="card">
							<h2 className="cardTitle">Upcoming Deadlines</h2>

							<div className="deadlineList">

								{deadlines.map((item) => (

									<div key={item.title} className="deadlineCard">

										<div>
											<div className="deadlineTitle">{item.title}</div>
											<div className="deadlineCourse">{item.course}</div>
										</div>

										<div className="deadlineRight">
											<div className="deadlineBadge">{item.due}</div>
											<div className="deadlineTime">{item.time}</div>
										</div>

									</div>

								))}

							</div>

						</section>


						<section className="focusCard">

							<div className="focusHeader">Recommended Focus</div>
							<div className="focusSub">Next task to tackle:</div>
							<div className="focusTitle">Capstone - PROJ 309 IDC</div>
							<div className="focusMeta">2 hours · High Priority</div>

						</section>

					</div>

				</div>

			</main>

		</div>
	);
}
