export enum EContestType {
  Live = 'Live',
  Solo = 'Solo',
}

export enum EQuestionType {
  SingleChoice = 'SingleChoice',
  MultipleChoice = 'MultipleChoice',
  TextEntry = 'TextEntry',
  TextEntryWithLength = 'TextEntryWithLength',
}

export enum EQuizStatus {
  Draft = 1,
  Published = 2,
}

export enum EQuizVisibility {
  Public = 1,
  Private = 2,
}

export enum EUserStatus {
  Inactive = 'Inactive',
  Active = 'Active',
}

export enum EUserRole {
  Admin = 'Admin',
  User = 'User',
}
