// export interface Address {
//     suite: string;
//     street: string;
//     zipcode: string;
//     city: string;
// }
// export interface User {
//     id: number;
//     email: string;
//     name: string;
//     phone: string;

// }



export interface Geo {
    lat: string;
    lng: string;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}
