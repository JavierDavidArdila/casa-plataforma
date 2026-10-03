// Listas del formulario de inscripción (Word del cliente, 2 oct 2026).
// Cada ciudad se guarda tal cual ("Estado: Ciudad").

export const PAISES_ORIGEN = [
  'Argentina', 'Bolivia', 'Brasil', 'Belice', 'Chile', 'Colombia', 'Costa Rica', 'Ecuador', 'El Salvador',
  'Guatemala', 'Guyana', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Surinam',
  'Uruguay', 'Venezuela',
]

export const PAISES_RESIDENCIA = ['Canadá', 'Estados Unidos', 'Otro'] as const

export const CIUDADES_CANADA = [
  'Alberta: Edmonton', 'Alberta: Calgary', 'British Columbia: Victoria', 'British Columbia: Vancouver',
  'Prince Edward Island: Charlottetown', 'Manitoba: Winnipeg', 'Nova Scotia: Halifax', 'New Brunswick: Fredericton',
  'Ontario: Toronto', 'Ontario: Ottawa', 'Ontario: Hamilton', 'Quebec: Quebec', 'Saskatchewan: Regina',
  "Newfoundland and Labrador: St. John's",
]

export const CIUDADES_USA = [
  'Alabama: Montgomery', 'Alaska: Juneau', 'Arizona: Phoenix', 'Arkansas: Little Rock', 'California: Sacramento',
  'California: Los Angeles', 'California: San Diego', 'California: San José', 'California: Fresno',
  'Colorado: Denver', 'Connecticut: Hartford', 'District of Columbia: Washington', 'Delaware: Dover',
  'Florida: Tallahassee', 'Florida: Miami', 'Florida: Hialeah', 'Florida: Fort Lauderdale', 'Florida: Orlando',
  'Florida: Tampa', 'Florida: Jacksonville', 'Florida: Cape Coral', 'Florida: Kissimmee', 'Florida: Hollywood',
  'Florida: Port St. Lucie', 'Georgia: Atlanta', 'Hawái: Honolulu', 'Idaho: Boise', 'Illinois: Springfield',
  'Indiana: Indianapolis', 'Iowa: Des Moines', 'Kansas: Topeka', 'Kentucky: Frankfort', 'Luisiana: Baton Rouge',
  'Maine: Augusta', 'Maryland: Annapolis', 'Massachusetts: Boston', 'Míchigan: Lansing', 'Minnesota: St. Paul',
  'Misisipi: Jackson', 'Misuri: Jefferson City', 'Montana: Helena', 'Nebraska: Lincoln', 'Nevada: Carson City',
  'New Hampshire: Concord', 'New Jersey: Trenton', 'New México: Santa Fe', 'New York: Albany', 'New York: New York',
  'North Carolina: Raleigh', 'North Dakota: Bismarck', 'Ohio: Columbus', 'Oklahoma: Oklahoma City', 'Oregón: Salem',
  'Pensilvania: Harrisburg', 'Rhode Island: Providence', 'South Carolina: Columbia', 'South Dakota: Pierre',
  'Tennessee: Nashville', 'Texas: Austin', 'Texas: Houston', 'Texas: San Antonio', 'Texas: Dallas',
  'Utah: Salt Lake City', 'Vermont: Montpelier', 'Virginia: Richmond', 'Washington: Olympia',
  'Virginia Occidental: Charleston', 'Wisconsin: Madison',
]

export const OTRA_CIUDAD = '__otra__'

export const GENEROS = ['Hombre', 'Mujer', 'Prefiero no decirlo']

export const PERSONAS_CUIDADAS = [
  'Mamá', 'Papá', 'Abuelo', 'Abuela', 'Hermana', 'Hermano', 'Pareja', 'Niños (hijos, sobrinos, nietos)', 'Otros familiares',
]

export const ANIOS_1_A_50 = Array.from({ length: 50 }, (_, i) => String(i + 1))
