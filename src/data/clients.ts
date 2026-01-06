export interface Client {
  name: string;
  logo: string;
  category: string;
}

export interface ClientCategory {
  name: string;
  clients: Client[];
}

export const clientCategories: ClientCategory[] = [
  {
    name: "IT & BPO",
    clients: [
      { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png", category: "IT & BPO" },
      { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png", category: "IT & BPO" },
      { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png", category: "IT & BPO" },
      { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Tech_Mahindra_New_Logo.svg/200px-Tech_Mahindra_New_Logo.svg.png", category: "IT & BPO" },
      { name: "HCL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/HCL_Technologies_logo.svg/200px-HCL_Technologies_logo.svg.png", category: "IT & BPO" }
    ]
  },
  {
    name: "Hospitality",
    clients: [
      { name: "Marriott", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Marriott_hotels_logo14.svg/200px-Marriott_hotels_logo14.svg.png", category: "Hospitality" },
      { name: "Hyatt", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hyatt_Logo.svg/200px-Hyatt_Logo.svg.png", category: "Hospitality" },
      { name: "Radisson", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Radisson_logo.svg/200px-Radisson_logo.svg.png", category: "Hospitality" },
      { name: "ITC Hotels", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/ITC_Hotels_logo.svg/200px-ITC_Hotels_logo.svg.png", category: "Hospitality" },
      { name: "Taj Hotels", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Taj_Hotels_logo.svg/200px-Taj_Hotels_logo.svg.png", category: "Hospitality" }
    ]
  },
  {
    name: "Healthcare",
    clients: [
      { name: "Apollo Hospitals", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Apollo_Hospitals_Logo.svg/200px-Apollo_Hospitals_Logo.svg.png", category: "Healthcare" },
      { name: "Fortis Healthcare", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fortis_Healthcare_logo.svg/200px-Fortis_Healthcare_logo.svg.png", category: "Healthcare" },
      { name: "Max Healthcare", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Max_Healthcare_logo.svg/200px-Max_Healthcare_logo.svg.png", category: "Healthcare" },
      { name: "Manipal Hospitals", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Manipal_Hospitals_Logo.svg/200px-Manipal_Hospitals_Logo.svg.png", category: "Healthcare" }
    ]
  },
  {
    name: "Malls & Retail",
    clients: [
      { name: "Phoenix Mills", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Phoenix_Mills_logo.svg/200px-Phoenix_Mills_logo.svg.png", category: "Malls & Retail" },
      { name: "Reliance Retail", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Reliance_Retail_logo.svg/200px-Reliance_Retail_logo.svg.png", category: "Malls & Retail" },
      { name: "Big Bazaar", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Big_Bazaar_Logo.svg/200px-Big_Bazaar_Logo.svg.png", category: "Malls & Retail" }
    ]
  },
  {
    name: "Education",
    clients: [
      { name: "Symbiosis", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Symbiosis_International_University_logo.svg/200px-Symbiosis_International_University_logo.svg.png", category: "Education" },
      { name: "MIT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png", category: "Education" }
    ]
  },
  {
    name: "Manufacturing",
    clients: [
      { name: "Tata Motors", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_Motors_Logo.svg/200px-Tata_Motors_Logo.svg.png", category: "Manufacturing" },
      { name: "Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mahindra_Rise_Logo.svg/200px-Mahindra_Rise_Logo.svg.png", category: "Manufacturing" },
      { name: "Bajaj Auto", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Bajaj_Auto_logo.svg/200px-Bajaj_Auto_logo.svg.png", category: "Manufacturing" }
    ]
  }
];
