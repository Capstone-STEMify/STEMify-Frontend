export enum ClassroomStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted' //soft delete
}

export enum EnrollmentStatus {
  ALL = 'ALL',
  ACTIVE = 'Active', // Currently enrolled
  PENDING = 'Pending', // Waiting for approval
  WITHDRAWN = 'Withdrawn' // Student left the class
}

export enum EnrollmentOrderBy {
  CLASSROOM_NAME_ASC = 'classroomNameAsc',
  CLASSROOM_NAME_DESC = 'classroomNameDesc',
  ENROLLDATE_ASC = 'enrolledDateAsc',
  ENROLLDATE_DESC = 'enrolledDateDesc'
}
