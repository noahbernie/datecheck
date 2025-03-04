// types/user.d.ts
declare module 'auth/authAction' {
    type DispatchFunction = (action: any) => void

    export function getCurrentUserDetails(callback?: () => void): (dispatch: DispatchFunction) => Promise<void>
}
