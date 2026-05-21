import React from 'react'
import type { RouteObject } from 'react-router-dom'
import Login from './auth.modul/Login.components'
import Signup from './auth.modul/Signup.components'
import Dashboard from './dashboard.modul/pages/Dashboard.page'
import AbscenceDemande from './abscence.modul/pages/AbsenceDemande.page'
import AbscenceListes from './abscence.modul/pages/AbscenceList.page'

const routes: RouteObject[] = [
	{
		path: '/',
		element: React.createElement(Login),
	},
	{
		path: '/signup',
		element: React.createElement(Signup),
	},
	{
		path: '/dashboard',
		element: React.createElement(Dashboard),
	},
	{
		path: '/abscence/demande',
		element: React.createElement(AbscenceDemande),
	},
	{
		path: '/abscence/list',
		element: React.createElement(AbscenceListes),
	},
]

export default routes

