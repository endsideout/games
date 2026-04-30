import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

useGLTF.preload("/models/RobotExpressive.glb");

const EXPRESSIONS = ["angry", "surprised", "sad", "happy"] as const;
type Expression = (typeof EXPRESSIONS)[number];

// Animations after the opening Wave — each plays exactly once, no consecutive repeats
const TALKING_ANIMS = ["Dance", "Jump", "Yes", "ThumbsUp"];

// Gap between animations (ms)
const GAP_MS = 500;

interface Props {
  isTalking: boolean;
}

export function MascotCharacter({ isTalking }: Props) {
  const group           = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
  const { actions, mixer }    = useAnimations(animations, group);

  const currentAction   = useRef<string | null>(null);
  const lastAnim        = useRef<string | null>(null);
  const scheduledTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTalkingRef    = useRef(false);
  const headMesh        = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    scene.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary && "happy" in mesh.morphTargetDictionary) {
        headMesh.current = mesh;
      }
    });
  }, [scene]);

  function setExpression(name: Expression, weight: number) {
    const mesh = headMesh.current;
    if (!mesh?.morphTargetDictionary || !mesh.morphTargetInfluences) return;
    const idx = mesh.morphTargetDictionary[name];
    if (idx !== undefined) mesh.morphTargetInfluences[idx] = weight;
  }

  function clearScheduled() {
    if (scheduledTimer.current) {
      clearTimeout(scheduledTimer.current);
      scheduledTimer.current = null;
    }
  }

  // Play an animation exactly once, cross-fading from whatever is current
  function playOnce(name: string) {
    const next = actions[name];
    if (!next) return;
    const prev = currentAction.current ? actions[currentAction.current] : null;
    next.reset();
    next.setLoop(THREE.LoopOnce, 1);
    next.clampWhenFinished = true;
    if (prev) next.crossFadeFrom(prev, 0.3, true);
    next.play();
    currentAction.current = name;
    lastAnim.current = name;
  }

  // Loop an animation (for idle)
  function playLoop(name: string) {
    if (currentAction.current === name) return;
    const next = actions[name];
    if (!next) return;
    const prev = currentAction.current ? actions[currentAction.current] : null;
    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    if (prev) next.crossFadeFrom(prev, 0.3, true);
    next.play();
    currentAction.current = name;
  }

  function randomTalkingExpression() {
    EXPRESSIONS.forEach(e => setExpression(e, 0));
    const r = Math.random();
    if (r < 0.4)       { setExpression("happy", 0.8); setExpression("surprised", 0.4); }
    else if (r < 0.7)  { setExpression("happy", 1); }
    else               { setExpression("surprised", 0.9); setExpression("happy", 0.3); }
  }

  // Schedule the next talking anim after a gap, ensuring no consecutive repeats
  function scheduleNext(afterMs: number) {
    clearScheduled();
    scheduledTimer.current = setTimeout(() => {
      if (!isTalkingRef.current) return;

      // Return to Idle briefly during the gap then play next
      playLoop("Idle");

      scheduledTimer.current = setTimeout(() => {
        if (!isTalkingRef.current) return;

        // Pick from pool excluding the last played
        const pool = TALKING_ANIMS.filter(a => a !== lastAnim.current);
        const next = pool[Math.floor(Math.random() * pool.length)];

        randomTalkingExpression();
        playOnce(next);

        // Schedule the next one after this clip finishes
        const clipDuration = (actions[next]?.getClip().duration ?? 1.5) * 1000;
        scheduleNext(clipDuration);
      }, GAP_MS);
    }, afterMs);
  }

  // Boot with Idle + happy
  useEffect(() => {
    if (!actions["Idle"]) return;
    EXPRESSIONS.forEach(e => setExpression(e, 0));
    setExpression("happy", 1);
    playLoop("Idle");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  // React to talking changes
  useEffect(() => {
    clearScheduled();
    isTalkingRef.current = isTalking;

    if (isTalking) {
      // Always start with Wave (say hi), then chain the others
      randomTalkingExpression();
      playOnce("Wave");
      const waveDuration = (actions["Wave"]?.getClip().duration ?? 1.5) * 1000;
      scheduleNext(waveDuration);
    } else {
      EXPRESSIONS.forEach(e => setExpression(e, 0));
      setExpression("happy", 1);
      playLoop("Idle");
    }

    return () => clearScheduled();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTalking]);

  useFrame((_, delta) => mixer.update(delta));

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={0.72}
        position={[0, -1.05, 0]}
        rotation={[0, 0.2, 0]}
      />
    </group>
  );
}
