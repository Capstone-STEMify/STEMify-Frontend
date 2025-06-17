export enum ClassroomStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted' //soft delete
}

export enum EnrollmentStatus {
  ACTIVE = 'Active', // Currently enrolled
  PENDING = 'Pending', // Waiting for approval
  WITHDRAWN = 'Withdrawn' // Student left the class
}
