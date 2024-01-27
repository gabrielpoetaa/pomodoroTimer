import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import * as zod from 'zod'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { act } from 'react-dom/test-utils'

/* 
why ...register('task') -> so it can return all the methods that comes with the register function. These methods are the 
same we use when working with inputs in javascript

function register(name:string){
  return(
    onchange: () => void,
    onBlur: () => void,
    onFocus() => void,
  )
 
}
*/

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Inform a task'),
  minutesAmount: zod
    .number()
    .min(5)
    .max(60, 'It must be a number between 5 and 60'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecodsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, formState, reset } =
    useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: '',
        minutesAmount: 0,
      },
    })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  console.log(activeCycle)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecodsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // console.log(formState.errors)

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">I will work with..</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Give a name for your project"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Project 1" />
            <option value="Project 2" />
            <option value="Project 3" />
          </datalist>

          <label htmlFor="minutesAmount">for</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            // max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutes</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
