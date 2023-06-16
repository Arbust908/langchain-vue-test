Here are the steps you can follow to migrate your Vue SFC from using the Composition API with a setup() method to the script setup format

1. Specify the Language and Setup Syntax: Start by specifying that you're using JavaScript and the setup syntax in your script tag. It should look something like this:

```vue
<script lang="ts" setup></script>
```

2. Move props and context to defineProps() and defineContext(): In a regular Composition API setup, the props and context are available as arguments to the setup() function. In the script setup format, you get props and context through the defineProps() and defineContext() functions. use an interface to define the props type

```vue
// Old
export default {
  props: {
    msg: String
  },
  setup(props) {
    // Use props.msg
  }
}

// New
interface Props {
  msg: string
}
const props = defineProps<Props>()

// Now you can use props.msg
```

3. Remove the setup() function: In the script setup format, there is no need for a setup() function. Instead, you directly write your Composition API code inside the <script> tag.

```vue
// Old export default { setup() { const count = ref(0) // ... } } // New const
count = ref(0) // ...
```

4.  Handle emits: If you need to use context.emit, you will use the defineEmits() function. This also serves as an opportunity to validate the event types.

    ```vue
    // Old export default { emits: ['update'], setup(props, { emit }) { //
    emit('update', ...) } } // New const emit = defineEmits(['update']) //
    emit('update', ...)
    ```

5.  Use withDefaults for default prop values: If you have props with default values, you would use the withDefaults method:

```vue
// Old export default { props: { size: { type: String, default: 'medium' } } }
// New const props = withDefaults(defineProps({ size: String }), { size:
'medium' })
```
