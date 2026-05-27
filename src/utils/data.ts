export type User = {
	id: number
	username: string
	fullName: string
	email: string
	role: string
    password: string
    status: string
}

export const provisionalUser: User = {
	id: 1,
	username: 'admin',
	fullName: 'ADMIN',
	email: 'admin@example.com',
	role: 'Administrateur',
    password: 'admin123',
	status: 'Actif',
}

export const users: User[] = [provisionalUser]
