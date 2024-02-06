'use client'

import { ButtonEvent, InputEvent } from "@/types/event"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export default function TiltImage() {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring  = useSpring(y)

    const rotateX = useTransform(
            mouseYSpring,
            [-0.5, 0.5],
            ["19..5deg", "-19.5deg"]
        )

        const rotateY = useTransform(
            mouseXSpring,
            [-0.5,0.5],
            ["-19.5deg", "19.5deg"]
        )

    const handleMouseMove = (e: any) => {

        const rect: DOMRect = e.target.getBoundingClientRect();

        const width: number = rect.width
        const height: number = rect.height

        const mouseX: number = e.clientX - rect.left
        const mouseY: number = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <div className="login100-pic">
            <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            >
            <img
                src="/images/img-01.png"
                alt="IMG"
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="w-[100%]"
            />
        </motion.div>
    </div>
    )
}
