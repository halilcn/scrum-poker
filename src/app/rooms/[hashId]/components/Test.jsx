"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const Test = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [emojiElements, setEmojiElements] = useState([]);
  
  // Her user için ref oluştur
  const userRefs = useRef({});

  // 3 user pozisyonu
  const users = [
    { id: 1, name: "User 1", x: 25, color: "bg-blue-500" },
    { id: 2, name: "User 2", x: 50, color: "bg-green-500" },
    { id: 3, name: "User 3", x: 75, color: "bg-purple-500" },
  ];

  useEffect(() => {
    if (!sceneRef.current) return;

    // Matter.js motor ve dünya ayarları
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Yerçekimi ayarı
    engine.world.gravity.y = 1;

    // Renderer oluşturma
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.offsetWidth,
        height: sceneRef.current.offsetHeight,
        wireframes: false,
        background: "transparent",
        showVelocity: false,
        showAngleIndicator: false,
      },
    });
    renderRef.current = render;

    // Zemin oluşturma (görünmez)
    const ground = Matter.Bodies.rectangle(
      sceneRef.current.offsetWidth / 2,
      sceneRef.current.offsetHeight - 5,
      sceneRef.current.offsetWidth,
      10,
      {
        isStatic: true,
        render: { visible: false },
      }
    );

    Matter.World.add(engine.world, [ground]);

    // Motor ve renderer'ı çalıştır
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Sürekli pozisyon güncellemesi için
    const updatePositions = () => {
      setEmojiElements((prev) => [...prev]);
    };

    const interval = setInterval(updatePositions, 16); // ~60fps

    // Cleanup
    return () => {
      clearInterval(interval);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  const getUserPosition = (userId) => {
    const userElement = userRefs.current[userId];
    if (!userElement || !sceneRef.current) return null;

    const userRect = userElement.getBoundingClientRect();
    const sceneRect = sceneRef.current.getBoundingClientRect();

    return {
      x: userRect.left - sceneRect.left + userRect.width / 2,
      y: userRect.top - sceneRect.top + userRect.height / 2,
    };
  };

  const throwEmojiToUser = (targetUserId) => {
    if (!engineRef.current || !sceneRef.current) return;

    const userPosition = getUserPosition(targetUserId);
    if (!userPosition) return;

    const targetX = userPosition.x;
    const targetY = userPosition.y - 30; // User'ın biraz üstünü hedefle

    const isFromLeft = Math.random() < 0.5;
    const startX = isFromLeft ? -30 : sceneRef.current.offsetWidth + 30;
    const startY = sceneRef.current.offsetHeight - 50;

    // Emoji için fizik objesi
    const emoji = Matter.Bodies.circle(startX, startY, 20, {
      restitution: 0.5,
      friction: 0.1,
      density: 0.001,
      render: { visible: false },
      label: "emoji",
    });

    // Hedef user'a doğru fırlatma kuvveti hesaplama
    const dx = targetX - startX;
    const dy = targetY - startY;

    const forceMultiplier = 0.00003;
    const forceX = dx * forceMultiplier;
    const forceY = dy * forceMultiplier - 0.02; // Ekstra yukarı kuvvet

    // Biraz rotasyon ekle
    Matter.Body.setAngularVelocity(emoji, isFromLeft ? 0.1 : -0.1);

    Matter.Body.applyForce(emoji, emoji.position, { x: forceX, y: forceY });
    Matter.World.add(engineRef.current.world, emoji);

    // User için collision body oluştur (sadece bu emoji için)
    const userCollisionBody = Matter.Bodies.rectangle(
      userPosition.x,
      userPosition.y,
      64,
      64,
      {
        isStatic: true,
        render: { visible: false },
        label: `user-${targetUserId}`,
      }
    );
    Matter.World.add(engineRef.current.world, userCollisionBody);

    // Emoji DOM elementi
    const emojiId = Date.now();
    const newEmoji = {
      id: emojiId,
      body: emoji,
      opacity: 1,
      fadeOut: false,
      rotation: 0,
      targetUserId,
    };

    setEmojiElements((prev) => [...prev, newEmoji]);

    // Çarpışma dinleyicisi
    const handleCollision = (event) => {
      const pairs = event.pairs;

      pairs.forEach((pair) => {
        // Hedef user'a çarptığında özel efekt ekleyebiliriz
        if (
          (pair.bodyA === emoji &&
            pair.bodyB.label === `user-${targetUserId}`) ||
          (pair.bodyB === emoji && pair.bodyA.label === `user-${targetUserId}`)
        ) {
          // User'a çarptı! Burada özel efekt ekleyebiliriz
          console.log(`Emoji hit user ${targetUserId}!`);
        }

        // Zemine çarptığında fade out başlat
        if (
          (pair.bodyA === emoji || pair.bodyB === emoji) &&
          emoji.position.y > sceneRef.current.offsetHeight - 40
        ) {
          setEmojiElements((prev) =>
            prev.map((e) => (e.id === emojiId ? { ...e, fadeOut: true } : e))
          );

          // 1 saniye sonra temizle
          setTimeout(() => {
            Matter.World.remove(engineRef.current.world, emoji);
            Matter.World.remove(engineRef.current.world, userCollisionBody);
            setEmojiElements((prev) => prev.filter((e) => e.id !== emojiId));
            Matter.Events.off(
              engineRef.current,
              "collisionStart",
              handleCollision
            );
          }, 1000);
        }
      });
    };

    Matter.Events.on(engineRef.current, "collisionStart", handleCollision);
  };

  return (
    <div className="bg-red-500 h-96 w-full relative overflow-hidden">
      {/* Matter.js canvas */}
      <div ref={sceneRef} className="absolute inset-0" style={{ zIndex: 1 }} />

      {/* User'lar */}
      {users.map((user) => (
        <div
          key={user.id}
          className="absolute flex flex-col items-center"
          style={{
            left: `${user.x}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          {/* User */}
          <div
            ref={(el) => (userRefs.current[user.id] = el)}
            className={`${user.color} flex items-center justify-center w-16 h-16 rounded-full text-white font-bold shadow-lg mb-4`}
          >
            {user.name}
          </div>

          {/* User'ın butonu */}
          <button
            onClick={() => throwEmojiToUser(user.id)}
            className="bg-white px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg text-sm"
          >
            Fırlat! 🎯
          </button>
        </div>
      ))}

      {/* Emoji elementleri */}
      {emojiElements.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-5xl transition-opacity duration-1000 select-none"
          style={{
            left: emoji.body.position.x - 25,
            top: emoji.body.position.y - 25,
            opacity: emoji.fadeOut ? 0 : 1,
            transform: `rotate(${emoji.body.angle}rad)`,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          😀
        </div>
      ))}
    </div>
  );
};

export default Test;
