import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import Login from './auth.modul/Login.components'
import Signup from './auth.modul/Signup.components'
import Dashboard from './dashboard.modul/pages/Dashboard.page'
import AbscenceDemande from './abscence.modul/pages/AbsenceDemande.page'
import AbscenceListes from './abscence.modul/pages/AbscenceList.page'
import TaskPage from './task.modul/pages/task.component'
import SubordonneesPage from './subordonnees.modul/pages/Subordonnees.page'
import ProtectedRoute from './auth.modul/ProtectedRoute'

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
		element: createElement(ProtectedRoute, null, createElement(Dashboard)),
	},
	{
		path: '/abscence/demande',
		element: createElement(ProtectedRoute, null, createElement(AbscenceDemande)),
	},
	{
		path: '/abscence',
		element: createElement(ProtectedRoute, null, createElement(AbscenceListes)),
	},
	{
		path: '/tasks',
		element: createElement(ProtectedRoute, null, createElement(TaskPage)),
	},
	{
		path: '/subordonnees',
		element: createElement(ProtectedRoute, null, createElement(SubordonneesPage)),
	},
]

export default routes

