class MyIO {
  constructor (io) {
    this.io = io
  }

  getIO () {
    return this.io
  }

  setIO (io) {
    this.io = io
  }
}
let sharedIO
export const setupSharedIO = (io) => {
  sharedIO = new MyIO(io)
}

export const getSharedIO = () => sharedIO.getIO()
