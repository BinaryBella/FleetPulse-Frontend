import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(accordionAnatomy.keys)

const custom = definePartsStyle({
    panel: {
        border: '1px solid',
        borderColor: 'gray.200',
        background: 'gray.50',
        borderRadius: 'full',

    },
    icon: {
        border: '1px solid',
        borderColor: 'gray.200',
        background: 'gray.200',
        borderRadius: 'full',
        color: 'gray.500',

    },
})

export const accordionTheme = defineMultiStyleConfig({
        variants: { custom },
    })
