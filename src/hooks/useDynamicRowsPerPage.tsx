"use client"
import { useState, useEffect } from 'react'

export function useDynamicRowsPerPage(minRows: number = 5, maxRows: number = 100) {
    const [optimalRowsPerPage, setOptimalRowsPerPage] = useState(10) // Default fallback

    useEffect(() => {
        const calculateOptimalRows = () => {
            const availableHeight = window.innerHeight - 150

            const headerHeight = 40 // search bar, filters, add contact button
            const tableHeaderHeight = 48 // table header 
            const tableFooterHeight = 48 // pagination controls
            const rowHeight = 60 // table row height
            const sapcing = 20 // spacing between content

            // remaining height for rows
            const remainingHeight = availableHeight - headerHeight - tableHeaderHeight - tableFooterHeight - sapcing

            // how many rows can fit
            const calculatedRows = Math.floor(remainingHeight / rowHeight)

            // it's within min/max bounds
            const optimalRows = Math.max(minRows, Math.min(maxRows, calculatedRows))

            return optimalRows
        }

        const handleResize = () => {
            const newOptimalRows = calculateOptimalRows()
            setOptimalRowsPerPage(newOptimalRows)
        }

        // initial value
        handleResize()

        // listen for window resize
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [minRows, maxRows])

    return optimalRowsPerPage
}