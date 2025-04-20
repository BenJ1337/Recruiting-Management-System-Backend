class Person {
  private name: string;
  private eMail?: string;
  private telephone?: number;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

export class HrRecruiter extends Person { }
export class HiringManager extends Person { }
export class Applicant extends Person { }
