import { withInstall } from '@m/utils'
import { defineComponent } from 'vue'

export const Button = withInstall(
  defineComponent({
    name: 'Button',
    setup(_props, { slots }) {
      return (): JSX.Element => {
        return <button> {slots.default?.()} </button>
      }
    }
  })
)
