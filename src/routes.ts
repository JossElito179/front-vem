import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import Login from './auth.modul/Login.components'
import Signup from './auth.modul/Signup.components'
import Dashboard from './dashboard.modul/pages/Dashboard.page'
import AbscenceDemande from './abscence.modul/pages/AbsenceDemande.page'
import AbscenceListes from './abscence.modul/pages/AbscenceList.page'
import TaskPage from './task.modul/pages/task.component'

const routes: RouteObject[] = [
	{
		path: '/',
		element: createElement(Login),
	},
	{
		path: '/signup',
		element: createElement(Signup),
	},
	{
		path: '/dashboard',
		element: createElement(Dashboard),
	},
	{
		path: '/abscence/demande',
		element: createElement(AbscenceDemande),
	},
	{
		path: '/abscence',
		element: createElement(AbscenceListes),
	},
	{
		path: '/tasks',
		element: createElement(TaskPage)
	}
]

export default routes

