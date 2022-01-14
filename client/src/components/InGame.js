import React from "react";
import * as BABYLON from "@babylonjs/core";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import 'babylonjs-loaders'
import "../App.css";

function onSceneReady(scene) {

  /* ----------Scene Physics---------- */

  scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());
  var PhysicsEngine = scene.getPhysicsEngine();
  PhysicsEngine.setGravity(new BABYLON.Vector3(0, -30, 0));



  /* ----------Camera---------- */

  // Debug Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(scene, true);

  // Final Camera
  /*
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -20), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(scene, true);
  */



  /* ----------Light---------- */
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;



  /* ----------Car---------- */

  // Car hit box dimension
  const carWidth = 3.2;
  const carDept = 8;
  const carHeight = 1

  // Create car hit box
  var car = BABYLON.MeshBuilder.CreateBox("car", { width: carWidth, height: carHeight, depth: carDept }, scene);

  var hitBoxMat = new BABYLON.StandardMaterial("hitBoxMat");  // Hitbox material
  hitBoxMat.alpha = 0;  // Make hit box transparent

  car.material = hitBoxMat;  // Apply material


  // Load car mesh
  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "car.babylon", scene, function (newMeshes) {
    const body = newMeshes[0];
    body.scaling = new BABYLON.Vector3(1.8, 1.8, 1.8);
    body.position.y = -0.5
    body.rotation.y = Math.PI;

    var carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture("/assets/texture/carBody.png", scene)
    body.material = carMat;

    body.parent = car;
  });

  car.position.y = 30; // Car initial location

  // Enable car physics
  car.physicsImpostor = new BABYLON.PhysicsImpostor(car, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
  car.checkCollisions = true;

  //LIGHTS
  const lightFrontLeft = new BABYLON.SpotLight("spotlightFL", new BABYLON.Vector3(-1, 0.88, 3.12), new BABYLON.Vector3(0,0, 1), Math.PI / 2, 20, scene)
  lightFrontLeft.intensity = 0.8;
  lightFrontLeft.diffuse = new BABYLON.Color3(0.94,0.91,0.68);
  lightFrontLeft.specular = new BABYLON.Color3(0.94,0.91,0.68);
  lightFrontLeft.parent = car;

  const lightFrontRight = new BABYLON.SpotLight("spotlightFR", new BABYLON.Vector3(1, 0.88, 3.12), new BABYLON.Vector3(0,0, 1), Math.PI / 2, 20, scene)
  lightFrontRight.intensity = 0.8;
  lightFrontRight.diffuse = new BABYLON.Color3(0.95,0.91,0.68);
  lightFrontRight.specular = new BABYLON.Color3(0.94,0.91,0.68);
  lightFrontRight.parent = car;

  const lightBackLeft = new BABYLON.SpotLight("spotlightBL", new BABYLON.Vector3(-1, 1.19, -3.0), new BABYLON.Vector3(0,0, -1), Math.PI / 2, 10, scene)
  lightBackLeft.intensity = 0.7;
  lightBackLeft.diffuse = new BABYLON.Color3(0.98,0,0);
  lightBackLeft.specular = new BABYLON.Color3(0.98,0,0);
  lightBackLeft.parent = car;

  const lightBackRight = new BABYLON.SpotLight("spotlightBR", new BABYLON.Vector3(1, 1.15, -3.25), new BABYLON.Vector3(0,0, -1), Math.PI / 2, 10, scene)
  lightBackRight.intensity = 0.7;
  lightBackRight.diffuse = new BABYLON.Color3(0.98,0,0);
  lightBackRight.specular = new BABYLON.Color3(0.98,0,0);
  lightBackRight.parent = car;
  



  // ------- WHEELS -------
  const rimMat = new BABYLON.StandardMaterial("rimMat", scene);
  rimMat.diffuseTexture = new BABYLON.Texture("/assets/texture/rim.png", scene);
  rimMat.bumpTexture = new BABYLON.Texture("/assets/texture/rimBump.png", scene);

  const tyreMat = new BABYLON.StandardMaterial("tyreMat");
  tyreMat.diffuseTexture = new BABYLON.Texture("/assets/texture/tyre.png", scene);
  tyreMat.bumpTexture = new BABYLON.Texture("/assets/texture/tyreBump.png", scene);
  tyreMat.roughness = 50;

  // Wheel Front Right
  const wheelFR = new BABYLON.Mesh("WheelFR", scene);

  var pivotFR = new BABYLON.Mesh("pivotFR", scene);
  pivotFR.parent = car;
  pivotFR.position.z = (carDept / 2 - (1.458));
  pivotFR.position.x = ((carWidth / 2) - 0.2);
  pivotFR.position.y = 0.1;


  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "rim.babylon", scene, function (newMeshes) {
    const rim = newMeshes[0];
    rim.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    rim.material = rimMat;
    rim.parent = wheelFR;
  })

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "tyre.babylon", scene, function (newMeshes) {
    const tyre = newMeshes[0];
    tyre.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    tyre.material = tyreMat;
    tyre.parent = wheelFR;
  })

  wheelFR.parent = pivotFR;


  // Wheel Front Left
  const wheelFL = new BABYLON.Mesh("wheelFL", scene);

  var pivotFL = new BABYLON.Mesh("pivotFL", scene);
  pivotFL.parent = car;
  pivotFL.position.z = (carDept / 2 - (1.458));
  pivotFL.position.x = -((carWidth / 2) - 0.2);
  pivotFL.position.y = 0.1;


  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "rim.babylon", scene, function (newMeshes) {
    const rim = newMeshes[0];
    rim.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    rim.rotation.y = Math.PI;
    rim.material = rimMat;
    rim.parent = wheelFL;
  });

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "tyre.babylon", scene, function (newMeshes) {
    const tyre = newMeshes[0];
    tyre.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    tyre.rotation.y = Math.PI;
    tyre.material = tyreMat;
    tyre.parent = wheelFL;
  });

  wheelFL.parent = pivotFL;


  // Wheel Back Right
  const wheelBR = new BABYLON.Mesh("wheelBR", scene);

  wheelBR.position.x = ((carWidth / 2) - 0.2);
  wheelBR.position.z = -(carDept / 2 - (1.8));
  wheelBR.position.y = 0.1;

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "rim.babylon", scene, function (newMeshes) {
    const rim = newMeshes[0];
    rim.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    rim.material = rimMat;
    rim.parent = wheelBR;
  })

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "tyre.babylon", scene, function (newMeshes) {
    const tyre = newMeshes[0];
    tyre.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    tyre.material = tyreMat;
    tyre.parent = wheelBR;
  })

  wheelBR.parent = car;


  // position for wheel Back Left
  const wheelBL = new BABYLON.Mesh("wheelBL", scene);

  wheelBL.position.x = -((carWidth / 2) - 0.2);
  wheelBL.position.z = -(carDept / 2 - (1.8));
  wheelBL.position.y = 0.1;

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "rim.babylon", scene, function (newMeshes) {
    const rim = newMeshes[0];
    rim.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    rim.rotation.y = Math.PI;
    rim.material = rimMat;
    rim.parent = wheelBL;
  })

  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "tyre.babylon", scene, function (newMeshes) {
    const tyre = newMeshes[0];
    tyre.scaling = new BABYLON.Vector3(0.85, 0.6, 0.6)
    tyre.rotation.y = Math.PI;
    tyre.material = tyreMat;
    tyre.parent = wheelBL;
  })

  wheelBL.parent = car;




  // Make camera follow car
  camera.parent = car;



  /* ----------Ground---------- */

  // Create ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 769, height: 462.5 }, scene);

  // Enable ground physics
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.9, restitution: 0 }, scene);
  ground.checkCollisions = true;
  var groundMat = new BABYLON.StandardMaterial("groundMat")
  groundMat.diffuseTexture = new BABYLON.Texture("https://pbs.twimg.com/media/EDieypNW4AURSe5.jpg");
  groundMat.diffuseTexture = new BABYLON.Texture("/assets/texture/track.jpg", scene);
  ground.material = groundMat;

  car.position.x = -50;
  car.position.z = 20;

  var birchTree = BABYLON.SceneLoader.ImportMesh("","./assets/models/","birch_tree.babylon",scene,function(newMeshes){
    for (let i = 0; i < newMeshes.length; i++) {
    newMeshes[i].scaling = new BABYLON.Vector3(12,12,12);
    newMeshes.position.x = -10;
    newMeshes.position.z = 20;
    
  }});

  const barriers = new BABYLON.Mesh("barriers", scene);

  BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "barrier.babylon", scene, function (meshes) {

    var redMat = new BABYLON.StandardMaterial("redMat", scene);
    redMat.diffuseColor = new BABYLON.Color3(0.8, 0, 0);

    var whiteMat = new BABYLON.StandardMaterial("redMat", scene);
    whiteMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);

    for (let i = 0; i < meshes.length; i++) {
      meshes[i].scaling = new BABYLON.Vector3(200, 200, 200);
      meshes[i].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[i], BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0, restitution: 0.3 }, scene);
      if (i % 2 == 0) {
        meshes[i].material = redMat;
      } else {
        meshes[i].material = whiteMat;
      }
      //meshes[i].rotation.y = Math.PI / 2;

      meshes[i].parent = barriers;
    }
  });
  barriers.rotation.y = 1.565;
  barriers.scaling = new BABYLON.Vector3(1.05,1.05,1.05)
  barriers.position.z = -93;
  barriers.position.x = 134;



  /* ----------Movement Physics---------- */

  // Forward & Backward force function
  function translate(mesh, direction, power) {
    mesh.physicsImpostor.setLinearVelocity(
      mesh.physicsImpostor.getLinearVelocity().add(
        transformForce(mesh, direction.scale(power))
      )
    );
  }

  // Transform force to matrix
  function transformForce(mesh, vec) {
    var mymatrix = new BABYLON.Matrix();
    mesh.rotationQuaternion.toRotationMatrix(mymatrix);
    return BABYLON.Vector3.TransformNormal(vec, mymatrix);
  };

  // Turning function
  function rotate(mesh, direction, power) {
    mesh.physicsImpostor.setAngularVelocity(
      mesh.physicsImpostor.getAngularVelocity().add(
        direction.scale(power)
      )
    );
  }


  // Keyboard value
  let mf = false;
  let mb = false;
  let rl = false;
  let rr = false;

  let direction = 1;


  /* ----------Keyboard Controller---------- */

  // Key pressed down
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 87: //w
        car.physicsImpostor.friction = 1
        mf = true;
        break;
      case 83: //s
        car.physicsImpostor.friction = 1
        mb = true;
        break;
      case 65: //a
        rl = true;
        break;
      case 68: //d
        rr = true;
        break;
    }
  });

  // Key released
  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case 87: //w
        car.physicsImpostor.friction = 2
        mf = false;
        break;
      case 83: //s
        car.physicsImpostor.friction = 2
        mb = false;
        break;
      case 65: //a
        rl = false;
        break;
      case 68: //d
        rr = false;
        break;
    }
  });

  // Declare variable
  let linearVelocity;

  // Acceleration Value
  const forcePower = 0.8;

  // Turning Speed Value
  const turnPower = 0.1;

  // Forward Max Speed
  const forwardSpeed = 45;

  // Reverse Max Speed
  const reverseSpeed = 20;


  // Function for wheel rotation
  function wheelRotation(value) {
    wheelFR.rotate(BABYLON.Axis.X, value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelFL.rotate(BABYLON.Axis.X, value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelBR.rotate(BABYLON.Axis.X, value * linearVelocity / 100, BABYLON.Space.LOCAL);
    wheelBL.rotate(BABYLON.Axis.X, value * linearVelocity / 100, BABYLON.Space.LOCAL);
  }


  // Function to get current vehicle speed
  function getValue() {
    linearVelocity = (Math.sqrt(car.physicsImpostor.getLinearVelocity().x ** 2 + car.physicsImpostor.getLinearVelocity().z ** 2)).toFixed(3);
  }


  // Function for wheel turning
  let theta = 0;
  let deltaTheta = 0;

  // Function that run before evey frame
  scene.registerBeforeRender(function () {

    getValue();

    wheelRotation(direction);

    // Move Forward
    if (mf === true && linearVelocity < forwardSpeed) {
      translate(car, new BABYLON.Vector3(0, 0, 1), forcePower);
      direction = 1;
    }

    // Move Backward
    if (mb === true) {

      // Brake Condition
      if (direction == 1 && linearVelocity > 0) {
        car.physicsImpostor.friction = 5
        //console.log("Brake")
      }

      // Check if vehicle already stoped
      if (linearVelocity == 0) {
        direction = -1;
      }

      // Reverse condition
      if (direction == -1) {
        car.physicsImpostor.friction = 1
        if (linearVelocity < reverseSpeed) {
          translate(car, new BABYLON.Vector3(0, 0, -1), forcePower);
        }
        //console.log("Reverse")
      }
    }

    //Turn Left
    if (rl === true) {
      if (theta > -Math.PI / 6) {
        deltaTheta = -Math.PI / 100;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
      rotate(car, new BABYLON.Vector3(0, -1 * direction, 0), turnPower);
    }

    // Return wheel to straight position
    if (rl === false) {
      if (theta.toFixed(3) < 0) {
        deltaTheta = Math.PI / 80;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
    }

    // Turn Right
    if (rr === true) {
      if (theta < Math.PI / 6) {
        deltaTheta = Math.PI / 100;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
      rotate(car, new BABYLON.Vector3(0, 1 * direction, 0), turnPower);
    }

    // Return wheel to straight position
    if (rr === false) {
      if (theta.toFixed(3) > 0) {
        deltaTheta = -Math.PI / 80;
        theta += deltaTheta;
        pivotFR.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
        pivotFL.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
      }
    }

    //console.log(car.physicsImpostor.friction)

  });

  return scene;
};



//Will run on every frame render.
function onRender(scene) {
  /*
    var canvas = scene.getEngine().getRenderingCanvas();
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine.getFps())
  */
};

export function InGame() {
  return (
    <div>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
    </div>
  )
};
