export type logEntry = {
  level: 'info' | 'error'
  label:
    | 'request'
    | 'error'
    | 'password'
    | 'email'
    | 'none'
    | 'email_error'
    | 'email_success'
  timestamp: Date
  data: logRequestType | any
}

type logRequestType = {
  ip: string
  method: string
  url: string
}
