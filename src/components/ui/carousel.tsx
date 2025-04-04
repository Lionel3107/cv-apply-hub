"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
  opts?: Parameters<typeof useEmblaCarousel>[0]
  plugins?: Parameters<typeof useEmblaCarousel>[1]
  className?: string
  children: React.ReactNode
}

type CarouselContextProps = {
  api: CarouselApi
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, opts, plugins }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(opts, plugins)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
      setIsMounted(true)
    }, [])

    return (
      <CarouselContext.Provider value={{ api: emblaApi }}>
        <div className={cn("relative", className)} ref={ref}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex select-none gap-2">{children}</div>
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>

const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("flex select-none gap-1", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
CarouselContent.displayName = "CarouselContent"

type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("relative min-w-0 flex-[1_0_100%]", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

type CarouselArrowProps = React.ComponentProps<typeof Button>

const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselArrowProps>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel()

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full opacity-75 hover:opacity-100",
          className
        )}
        onClick={() => api?.scrollPrev()}
        disabled={!api}
        ref={ref}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselArrowProps>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel()

    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2 h-8 w-8 rounded-full opacity-75 hover:opacity-100",
          className
        )}
        onClick={() => api?.scrollNext()}
        disabled={!api}
        ref={ref}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
