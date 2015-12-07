TDAFW.ActionBlocks.Rotate = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);			
			
			this.update = function (delta) {
				var angular_velocity = this.get("angular_velocity");
				var threeObject = this.getTargetThreeObject();
				if (threeObject instanceof THREE.Object3D && angular_velocity) {
					threeObject.rotation.x += delta * angular_velocity.x;
					threeObject.rotation.y += delta * angular_velocity.y;
					threeObject.rotation.z += delta * angular_velocity.z;
				}
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.Move = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);			
					
			this.update = function (delta) {			
				var velocity = this.get("velocity");				
				var threeObject = this.getTargetThreeObject();
				
				if (threeObject instanceof THREE.Object3D && velocity) {
					threeObject.position.x += delta * velocity.x;
					threeObject.position.y += delta * velocity.y;
					threeObject.position.z += delta * velocity.z;
				}
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.Trace = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			this.update = function (delta) {
				var maxDistance = this.get("maxDistance");
				var targetAbstractNodeName = this.get("targetAbstractNodeName");
				
				var threeObject = this.getTargetThreeObject();
				if (threeObject instanceof THREE.Object3D) {
					var targetAbstractNode = fw.getAbstractNodeByName(targetAbstractNodeName);
					if (targetAbstractNode) {
						var targetThreeObject = targetAbstractNode.getTargetThreeObject();
						var distance = new THREE.Vector3(targetThreeObject.position.x, targetThreeObject.position.y, targetThreeObject.position.z);					
						distance.sub(threeObject.position);
						if (distance.length() > maxDistance) {
							distance.setLength(distance.length() - maxDistance);
							threeObject.position.add(distance);
						}						
					}
				}
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.If = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			var checkIf = function() {
				var propertyName = this.get("propertyName");
				var animationProperty = fw.animationProperties.get(propertyName);
				if (animationProperty) {
					return true;
				} else {
					return false;
				}
			};
						
			this.preUpdate = function (delta) {
				return checkIf();
			};
			this.update = function (delta) {
				return checkIf();
			};
			this.postUpdate = function (delta) {
				return checkIf();
			};
			this.preRender = function (delta) {
				return checkIf();
			};
			this.postRender = function (delta) {
				return checkIf();
			};
			
			this.internalEvent = function (eventObject) {
				return checkIf();
			};
			
			this.externalEvent = function (eventObject) {
				return checkIf();
			};
			
			this.fwEvent = function (eventObject) {
				return checkIf();
			};
		}	
	}
);


TDAFW.ActionBlocks.IfNot = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			var checkIfNot = function () {
				var propertyName = this.get("propertyName");
				var animationProperty = fw.animationProperties.get(propertyName);
				if (!animationProperty) {
					return true;
				} else {
					return false;
				}
			};
						
			this.preUpdate = function (delta) {
				return checkIfNot();
			};
			this.update = function (delta) {
				return checkIfNot();
			};
			this.postUpdate = function (delta) {
				return checkIfNot();
			};
			this.preRender = function (delta) {
				return checkIfNot();
			};
			this.postRender = function (delta) {
				return checkIfNot();
			};
			
			this.internalEvent = function (eventObject) {
				return checkIfNot();
			};
			
			this.externalEvent = function (eventObject) {
				return checkIfNot();
			};
			
			this.fwEvent = function (eventObject) {
				return checkIfNot();
			};
		}	
	}
);

TDAFW.ActionBlocks.RigidBodyMotion = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			var velocity_attr = this.get("velocity");
			var velocity = new THREE.Vector3(velocity_attr.x, velocity_attr.y, velocity_attr.z);
			
			this.on('change:velocity', function() {
				velocity_attr = this.get("velocity");
				velocity.set(velocity_attr.x, velocity_attr.y, velocity_attr.z);
			});				
		
			/** 
			* method updating position and rotation with respect to the velocity and angular velocity			
			* @param delta : time delta
			*/
			
			this.update = function (delta) {
				var threeObject = this.getTargetThreeObject();
				if (threeObject instanceof THREE.Object3D) {					
					var displacement = new THREE.Vector3(velocity.x, velocity.y, velocity.z);					
					displacement.multiplyScalar(delta);
					threeObject.position.add(displacement);
				}
				return true;
			};
			
			/** 
			* method applying acceleration to the velocity			
			* @param acceleration : acceleration vector THREE.Vector3
			* @param delta : time delta
			*/
			
			this.applyAcceleration = function(acceleration, delta) {
				var velocity_delta = new THREE.Vector3(acceleration.x, acceleration.y, acceleration.z);
				velocity_delta.multiplyScalar(delta);
				velocity.add(velocity_delta);
				this.set("velocity",{x:velocity.x, y:velocity.y, z:velocity.z});				
			}
		}	
	}
);

TDAFW.ActionBlocks.Acceleration = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();			
			
			var acceleration_attr = this.get("acceleration");
			var acceleration = new THREE.Vector3(acceleration_attr.x, acceleration_attr.y, acceleration_attr.z);
			
			this.on('change:acceleration', function() {
				acceleration_attr = this.get("acceleration");
				acceleration.set(acceleration_attr.x, acceleration_attr.y, acceleration_attr.z);
			});	
			
			/** 
			* method updating velocity of target rigid body motion			
			* @param delta : time delta
			*/
			
			this.preUpdate = function (delta) {
				var rigidBodyMotion = this.getNearestAncestorByType("RigidBodyMotion");
				if (rigidBodyMotion instanceof TDAFW.ActionBlocks.RigidBodyMotion) {
					rigidBodyMotion.applyAcceleration(acceleration, delta);					
				}
				return true;
			};			
		}	
	}
);

/******************************************************************************************************************
* Action Block Name: Spring
* Description: Accelerate the nearest ancestor RigidBodyMotion action block with respect to the spring force.
* Attributes: 
* - "targetAbstractNodeName" : target abstract node name.
* - "stiffness" : spring constant k.
**********************************************************************************************************************/

TDAFW.ActionBlocks.Spring = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			this.preUpdate = function (delta) {
				var rigidBodyMotion = this.getNearestAncestorByType("RigidBodyMotion");
				if (rigidBodyMotion instanceof TDAFW.ActionBlocks.RigidBodyMotion) {
					var threeObject = this.getTargetThreeObject();
					if (threeObject instanceof THREE.Object3D) {
						var targetAbstractNodeName = this.get("targetAbstractNodeName");
						var targetAbstractNode = fw.getAbstractNodeByName(targetAbstractNodeName);
						if (targetAbstractNode) {
							var stiffness = this.get("stiffness");
							var targetThreeObject = targetAbstractNode.getTargetThreeObject();
							var acceleration = new THREE.Vector3(targetThreeObject.position.x, targetThreeObject.position.y, targetThreeObject.position.z);						
							acceleration.sub(threeObject.position);
							acceleration.multiplyScalar(stiffness);						
							rigidBodyMotion.applyAcceleration(acceleration, delta);					
						}
					}
				}
				return true;
			};		
		}	
	}
);


TDAFW.ActionBlocks.SplineCurveTracking = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			var playing = this.get("autoStart");
			var totalPlayTime = this.get("playTime");
			if (totalPlayTime < 0.0001) 
				totalPlayTime = 1.0;
			var elapsed_time = 0;			
			var initialControlPointsArray = this.get("controlPoints");
			var controlPointsArray = [];
			for (var i = 0; i < initialControlPointsArray.length; i++) {
				var controlPoint = new THREE.Vector3(initialControlPointsArray[i].x, initialControlPointsArray[i].y, initialControlPointsArray[i].z);
				controlPointsArray.push(controlPoint);
			}
			var splineCurve = new THREE.SplineCurve3(controlPointsArray);
			/**
				Animation loop event handlers
			*/			
			this.update = function(delta) {
				if (playing) {
					elapsed_time += delta;
					if (elapsed_time > totalPlayTime ) {
						playing = false;
						elapsed_time = totalPlayTime;
					}
					var threeObject = this.getTargetThreeObject();
					if (threeObject instanceof THREE.Object3D) {
						threeObject.position.copy(splineCurve.getPoint(elapsed_time / totalPlayTime));
					}
				}
				
				return true;
			};
			
			/*** 
				APIs for tracking control
			**/
			this.start =  function () {
				if (!playing) {
					playing = true;
					elapsed_time = 0;
				}
			};
			this.pause =  function () {
				if (playing) {
					playing = true;
					elapsed_time = 0;
				}
			};
			this.stop = function () {
				if (playing) {
					playing = false;
					elapsed_time = 0;
				}
			};
			
		}	
	}
);

TDAFW.ActionBlocks.PickTest = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);
			var ratio = 0.5;			
					
			this.fwEvent = function (param) {							
				if (param.event === "picked") {
					var threeObject = param.abstractNode.getTargetThreeObject();
					
					if (threeObject instanceof THREE.Object3D) {						
						threeObject.scale.x *= ratio;
						threeObject.scale.y *= ratio;
						threeObject.scale.z *= ratio;
						ratio = 1 / ratio;
					}
				}
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.PickTest2 = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);			
					
			var fw = this.getFW();	
			
			this.fwEvent = function (param) {							
				if (param.event === "picked") {					
					var rotateAB = fw.getActionBlockByName("Rotate1");
					if (rotateAB) {
						var angular_velocity = rotateAB.get("angular_velocity");
						rotateAB.set("angular_velocity",{x:angular_velocity.x, y:-angular_velocity.y, z:angular_velocity.z});
					}					
				}
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.OrbitControls = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);
			
			var fw = this.getFW();			
			var orbitControls;		
					
			this.preRender = function (delta) {
				if (!orbitControls) {
					orbitControls = new THREE.OrbitControls(this.getTargetThreeObject(), fw.getCanvas());
					var target_attr = this.get("target");
					var target = new THREE.Vector3(target_attr.x, target_attr.y, target_attr.z);
					orbitControls.target.copy(target);	
				}
				orbitControls.update();					
				return true;
			};
		}	
	}
);

TDAFW.ActionBlocks.LookAt = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);					
			
			var fw = this.getFW();
			
			this.preUpdate = function (delta) {
				var threeObject = this.getTargetThreeObject();
				var targetAbstractNodeName = this.get("targetAbstractNodeName");
				var targetAbstractNode = fw.getAbstractNodeByName(targetAbstractNodeName);
				if (threeObject instanceof THREE.Object3D && targetAbstractNode) {										
					var targetThreeObject = targetAbstractNode.getTargetThreeObject();
					threeObject.lookAt(targetThreeObject.position);
				}
				return true;
			};		
		}	
	}
);

TDAFW.ActionBlocks.StatsAB = TDAFW.ActionBlock.extend(
	{
		constructor: function(arg, options) {		
			
			TDAFW.ActionBlock.apply(this, arguments);
			
			var stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			this.getFW().getCanvas().parentNode.appendChild( stats.domElement );
			
			this.postRender = function (delta) {
				stats.update();
				return true;
			};
		}	
	}
);


