'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-list-order'
import { updateCardOrder } from '@/actions/update-card-order'

import { ListWithCards } from '@/types'

import { ListForm } from './list-form'
import { ListItem } from './list-item'

interface ListContainerProps {
  data: ListWithCards[]
  boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data)

  const { execute: executeUpdateListOrder, fieldErrors } = useAction(
    updateListOrder,
    {
      onSuccess: () => {
        toast.success(`List reordered successful`)
      },
      onError: (error) => {
        toast.error(error)
      }
    }
  )

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(`Card reordered successful`)
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result

    if (!destination) {
      return
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // If move a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      )

      setOrderedData(items)

      executeUpdateListOrder({ items, boardId })
    }

    if (type === 'card') {
      let newOrderedData = [...orderedData]

      //   Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      )
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      )

      if (!sourceList || !destList) {
        return
      }

      //   Check if cards exists on  the sourceList
      if (!sourceList.cards) {
        sourceList.cards = []
      }

      //   check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = []
      }

      //   moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, idx) => {
          card.order = idx
        })

        sourceList.cards = reorderedCards

        setOrderedData(newOrderedData)

        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards
        })
      } else {
        // If move to the another list
        const [moveCard] = sourceList.cards.splice(source.index, 1)

        // Assign the new listId to the moved card
        moveCard.listId = destination.droppableId

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, moveCard)

        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        })

        // Update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx
        })

        setOrderedData(newOrderedData)
        // TODO: Trigger server action
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            className='flex gap-x-3 h-full'
            ref={provided.innerRef}
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />
            })}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1'></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
