import DetailsUser from "@/components/Users/Details";


const mockUser = {
  user_id: "usr_001",
  username: "jacobo.hernandez",
  name: "Jacobo",
  last_name: "Hernández",
  second_last_name: "Mendieta",
  email: "jacobo@example.com",
  phone: "+52 55 1234 5678",
  profile_picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  status: "active",
  last_login: "2025-08-23T14:00:00Z",
  biografia: "Consultor tecnológico enfocado en arquitectura de sistemas frontend, trazabilidad y seguridad escalonada.",
  preferences: {
    id: "pref_001",
    theme: "dark",
    notifications: true,
    timezone: "America/Mexico_City",
    lang: "es-MX"
  },
  userBusiness: {
    id: "biz_001",
    job_title: "Tech Consultant",
    department: "Arquitectura de Sistemas",
    hire_date: "2022-03-15",
    branch_id: "azc_branch_01"
  },
  location: {
    location_id: "loc_001",
    street_name: "Av. Azcapotzalco",
    street_number: "123",
    neighborhood: "San Marcos",
    city: "Ciudad de México",
    state: "CDMX",
    postal_code: "02700",
    country: "México"
  }
};

export default function UserPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <DetailsUser user={mockUser} userKey={id} />;
}