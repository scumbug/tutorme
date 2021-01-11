# User object

```
{
    id: number
    created_at: date
    updated_at: date
    username: string
    password: string
    name: string
    phone: number
    email: string
    address: string
    dob: date
    subjects: number[]
    roles: number
}
```

# Lesson object

```
{
    id: number
    created_at: date
    updated_at: date
    subject: number
    tutor: number
    tutee: number
    date: date
    duration: date
    paid: boolean
}
```

# Subject object

```
{
    id: number
    created_at: date
    updated_at: date
    name: string
    level: number
    fees: number
}
```
