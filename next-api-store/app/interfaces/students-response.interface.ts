export interface Student {
    id:       string;
    name:     string;
    age:      number;
    email:    string;
    nickname: string;
    gender:   string;
    subjects: string[];
    grade:    Grade[];
}

export interface Grade {
    id:      string;
    subject: string;
    grade:   string;
}
