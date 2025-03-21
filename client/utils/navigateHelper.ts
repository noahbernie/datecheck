// navigateHelper.ts
let navigateFunction: (path: string) => void

export const setNavigate = (nav: (path: string) => void) => {
    navigateFunction = nav
}

export const navigateTo = (path: string) => {
    if (navigateFunction) {
        navigateFunction(path)
    } else {
        console.error('Navigate function is not initialized yet.')
    }
}
