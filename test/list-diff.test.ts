import { simpleListDiff, simpleListDiffWithSort } from '../src/list-diff'
import { simpleObjDiff } from '../src/obj-diff'

describe('simple-list-diff', () => {

  it('error-param', () => {
    try {
      simpleListDiff({
        newVal: 1 as any,
        oldVal: 2 as any,
        options: {
          key: 'id',
          getChangedItem: () => { }
        }
      })
    } catch (e) {
      expect(e).toEqual(new Error("params newVal must be a Array"))
    }
  })

  it('equal-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('remove-item', () => {
    expect(simpleListDiff({
      newVal: [],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [{
        id: 1
      }],
      modifiedLines: [],
    })
  })

  it('add-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        id: 2, cc: 'bbc'
      }],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('add-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 2, cc: 'bbc' }, { id: 1, cc: 'bb' },],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        id: 2, cc: 'bbc'
      }],
      deletedLines: [],
      modifiedLines: [],
    })
  })

  it('modifie-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [],
      deletedLines: [],
      modifiedLines: [{
        id: 1, cc: 'bbc'
      }],
    })
  })

  it('change-all-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      addedLines: [{
        bb: '123'
      }],
      deletedLines: [{
        id: 2
      }],
      modifiedLines: [{
        id: 1,
        cc: 'bbc'
      }],
    })
  })


  it('change-all-item', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        isSplit: false
      }
    })).toEqual({
      lines: [{
        cc: 'bbc',
        id: 1,
        rowState: "modified",
      }, {
        bb: '123', rowState: 'added'
      }, {
        id: 2,
        rowState: 'deleted'
      }],
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount', 'modifiedCount', 'deletedCount'],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        isSplit: false
      }
    })).toEqual({
      addedCount: 1,
      modifiedCount: 1,
      deletedCount: 1,
      lines: [{
        cc: 'bbc',
        id: 1,
        rowState: "modified",
      }, {
        bb: '123', rowState: 'added'
      }, {
        id: 2,
        rowState: 'deleted'
      }],
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount', 'modifiedCount', 'deletedCount'],
        key: 'id',
        isSplit: false
      }
    })).toEqual({
      addedCount: 1,
      modifiedCount: 1,
      deletedCount: 1,
      lines: [{
        cc: 'bbc',
        id: 1,
        rowState: "modified",
      }, {
        bb: '123', rowState: 'added'
      }, {
        id: 2,
        rowState: 'deleted'
      }],
    })
  })


  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount',],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        isSplit: false
      }
    })).toEqual({
      addedCount: 1,
      lines: [{
        cc: 'bbc',
        id: 1,
        rowState: "modified",
      }, {
        bb: '123', rowState: 'added'
      }, {
        id: 2,
        rowState: 'deleted'
      }],
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiff({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['deletedCount',],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
        isSplit: false
      }
    })).toEqual({
      deletedCount: 1,
      lines: [{
        cc: 'bbc',
        id: 1,
        rowState: "modified",
      }, {
        bb: '123', rowState: 'added'
      }, {
        id: 2,
        rowState: 'deleted'
      }],
    })
  })


  it('error-param', () => {
    try {
      simpleListDiffWithSort({
        newVal: 1 as any,
        oldVal: 2 as any,
        options: {
          key: 'id',
          getChangedItem: () => { }
        }
      })
    } catch (e) {
      expect(e).toEqual(new Error("params newVal must be a Array"))
    }
  })

  it('equal-item', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 1,
        rowState: 'noChange',
      }],
      sortChanged: false,
    })
  })

  it('remove-item', () => {
    expect(simpleListDiffWithSort({
      newVal: [],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 1,
        rowState: 'deleted',
      }],
      sortChanged: true,
    })
  })

  it('add-item', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 1,
        rowState: 'noChange',
      }, {
        id: 2,
        cc: 'bbc',
        rowState: 'added',
      }],
      sortChanged: true,
    })
  })

  it('add-item-sort', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 2, cc: 'bbc' }, { id: 1, cc: 'bb' },],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 2,
        cc: 'bbc',
        rowState: 'added',
      }, {
        id: 1,
        rowState: 'noChange',
      }],
      sortChanged: true,
    })
  })


  it('modifie-item', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 1, cc: 'bbc' }],
      oldVal: [{ id: 1, cc: 'bb' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 1,
        cc: 'bbc',
        rowState: 'modified',
      }],
      sortChanged: false,
    })
  })

  it('change-all-item', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 1, cc: 'bbc' }, { bb: '123' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        cc: "bbc",
        id: 1,
        rowState: "modified",
      }, {
        bb: '123',
        rowState: 'added',
      }, {
        id: 2,
        rowState: "deleted",
      }],
      sortChanged: true,
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ bb: '123' }, { id: 1, cc: 'bbc' },],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount', 'modifiedCount', 'deletedCount'],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [ {
        bb: '123',
        rowState: 'added',
      },{
        cc: "bbc",
        id: 1,
        rowState: "modified",
      }, {
        id: 2,
        rowState: "deleted",
      }],
      addedCount: 1,
      modifiedCount: 1,
      deletedCount: 1,
      sortChanged: true
    })
  })

  it('change-all-item-all-count', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ bb: '123' }, { id: 1, cc: 'bbc' },],
      oldVal: [{ id: 1, cc: 'bb' }, {id: 3, cc: 234}, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount', 'modifiedCount', 'deletedCount'],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [ {
        bb: '123',
        rowState: 'added',
      },{
        cc: "bbc",
        id: 1,
        rowState: "modified",
      }, {
        id: 3,
        rowState: "deleted",
      }, {
        id: 2,
        rowState: "deleted",
      }],
      addedCount: 1,
      modifiedCount: 1,
      deletedCount: 2,
      sortChanged: true
    })
  })


  it('change-all-item-all-count-sort', () => {
    expect(simpleListDiffWithSort({
      newVal: [{ id: 2, cc: 'bdf' }, { id: 3, bb: '333' }, { id: 1, cc: 'bb' }],
      oldVal: [{ id: 1, cc: 'bb' }, { id: 3, bb: '333' }, { id: 2, cc: 'bdf' }],
      options: {
        fields: ['addedCount', 'modifiedCount', 'deletedCount'],
        getChangedItem: ({
          newLine,
          oldLine,
        }) => {
          const result = simpleObjDiff({
            newVal: newLine,
            oldVal: oldLine,
          })
          if (!Object.keys(result).length) {
            return null
          }
          return { id: newLine.id, ...result }
        },
        key: 'id',
      }
    })).toEqual({
      lines: [{
        id: 2,
        rowState: 'noChange',
      }, {
        id: 3,
        rowState: 'noChange',
      }, {
        id: 1,
        rowState: "noChange",
      }],
      addedCount: 0,
      modifiedCount: 0,
      deletedCount: 0,
      sortChanged: true,
    })
  })


})