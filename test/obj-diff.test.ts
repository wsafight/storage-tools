import { simpleObjDiff } from '../src/obj-diff'

describe('somple-obj-diff', () => {
  
  it('error-param', () => {
    try {
      simpleObjDiff({
        newVal: 1 as any,
        oldVal: 2 as any,
      })
    } catch(e) {
      expect(e).toEqual(new Error("params newVal must be a Object"))
    }
  })

  it('remove-item', () => {
    expect(simpleObjDiff({newVal: {}, oldVal: {b: 1}})).toEqual({ b: null })
  })

  it('add-item', () => {
    expect(simpleObjDiff({newVal: {b: 1}, oldVal: {}})).toEqual({ b: 1 })
  })

  it('change-item', () => {
    expect(simpleObjDiff({newVal: {b: 1}, oldVal: {b: 123}})).toEqual({ b: 1 })
  })

  it('multiple-item', () => {
    expect(simpleObjDiff({
      newVal: { b: 1, c: 12,},
      oldVal: {
        b: 123, a: 123213
      }
    })).toEqual({ b: 1, c: 12, a: null })
  })

  it('add-item', () => {
    expect(simpleObjDiff({
      newVal: { b: new Date('2020-01-02'), c: 23, d: 32423, e: 3234 },
      oldVal: {b: 123},
    })).toEqual({ b: new Date('2020-01-02'), c: 23, d: 32423, e: 3234 })
  })

  it('empty-param', () => {
    expect(simpleObjDiff({
      newVal: {},
      oldVal: {a: 1},
      options: {
        empty: ''
      }
    })).toEqual({ a: '' })
  })

  it('empty-param-undefine', () => {
    expect(simpleObjDiff({
      newVal: {},
      oldVal: {a: 1},
      options: {
        empty: null
      }
    })).toEqual({ a: null })
  })

  it('no-diffFun-params', () => {
    expect(simpleObjDiff({
      newVal: { a: [12, 3, 4] },
      oldVal: { a: [1, 2, 3]}
    })).toEqual({ a: [12, 3, 4] })
  })

  it('diffFun-params', () => {
    expect(simpleObjDiff({
      newVal: { a: [12, 3, 4], b: 11 },
      oldVal: { a: [1, 2, 3], c: 22 },
      options: {
        diffFun: ({
          key,
          oldPropVal,
          newPropVal
        }) => {
          switch (key) {
            case 'a':
              return newPropVal.filter((item: any) => oldPropVal.includes(item))
          }
          return null
        }
      }
    })).toEqual({ a: [3], b: 11, c: null })
  })

  it('diffFun-number', () => {
    expect(simpleObjDiff({
      newVal: {a: 1}, 
      oldVal: {a: 2}
    })).toEqual({a: 1})
  })

  it('diffFun-string', () => {
    expect(simpleObjDiff({
      newVal: {a: '1'},
      oldVal: {a: 2}
    })).toEqual({a: '1'})
  })

  it('diffFun-obj', () => {
    expect(simpleObjDiff({
      newVal: { a: {a: '1'} },
      oldVal: { a: 2 }
    },)).toEqual({a: {a: '1'}})
  })

  it('diffFun-obj', () => {
    expect(simpleObjDiff({
      newVal: { a: {a: '1'} },
      oldVal: { a: 2}
    })).toEqual({a: {a: '1'}})
  })

  it('diffFun-list', () => {
    expect(simpleObjDiff({
      newVal: { a: {a: [1,2]} },
      oldVal: { a: 2 }
    })).toEqual({a: {a:[1,2]}})
  })

  it('diffFun-empty', () => {
    expect(simpleObjDiff({
      newVal: {a: null, c: ''},
      oldVal: {a: null, c: ''}
    })).toEqual({})
  })

  it('diffFun-obj-copy', () => {
    expect(simpleObjDiff({
      newVal:  { a: {a: '1'} },
      oldVal: { a: 2 }
    })).toEqual({a: {a: '1'}})
  })

  it('fix', () =>{
    expect( simpleObjDiff({
      newVal: {
        b: 1,
        c: 12,
        e: '123',
        f: ['2131', 231, '1111'],
      },
      oldVal: {
        b: 123,
        a: 123213,
        e: '123',
        f: ['2131', 231, '1111'],
      }
    })).toEqual({ b: 1, c: 12, a: null })
  })
})