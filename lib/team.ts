export type TeamMember = {
  name: string
  role: string
  department: 'Leadership' | 'Logistics' | 'Program' | 'Marketing' | 'Partnerships' | 'Finance'
}

// Replace with the real names and roles of the organizing committee.
export const team: TeamMember[] = [
  { name: 'Yasmine Ben Ali', role: 'Organizing Committee President', department: 'Leadership' },
  { name: 'Aziz Trabelsi', role: 'Vice President', department: 'Leadership' },
  { name: 'Mariem Gharbi', role: 'Logistics Manager', department: 'Logistics' },
  { name: 'Oussama Hammami', role: 'Logistics Member', department: 'Logistics' },
  { name: 'Rania Jaziri', role: 'Logistics Member', department: 'Logistics' },
  { name: 'Skander Mejri', role: 'Program Manager', department: 'Program' },
  { name: 'Ines Chaabane', role: 'Sessions Coordinator', department: 'Program' },
  { name: 'Khalil Bouazizi', role: 'Agenda & Activities', department: 'Program' },
  { name: 'Nour Saidi', role: 'Marketing Manager', department: 'Marketing' },
  { name: 'Amine Karoui', role: 'Graphic Designer', department: 'Marketing' },
  { name: 'Salma Dridi', role: 'Content Creator', department: 'Marketing' },
  { name: 'Hamza Ferchichi', role: 'Partnerships Manager', department: 'Partnerships' },
  { name: 'Eya Mansouri', role: 'Partnerships Member', department: 'Partnerships' },
  { name: 'Firas Zouari', role: 'Finance Manager', department: 'Finance' },
]
