extends CharacterBody2D

@export var movement_duration : float = 0.5

@onready var ic: InteractionComponent = $InteractionComponent
@onready var shake_component: ShakeComponent = $ShakeComponent

var player_area : String

@onready var area_left: Area2D = $AreaLeft
@onready var area_top: Area2D = $AreaTop
@onready var area_right: Area2D = $AreaRight
@onready var area_bottom: Area2D = $AreaBottom

var player : Player

var tween : Tween

func _ready():
	player = get_tree().get_first_node_in_group("Player")
	ic.interaction = push

func push():
	if player in area_top.get_overlapping_bodies():
		if not area_bottom.has_overlapping_bodies():
			move(Vector2.DOWN)
		else:
			shake_component.trigger_x()

	elif player in area_bottom.get_overlapping_bodies():
		if not area_top.has_overlapping_bodies():
			move(Vector2.UP)
		else:
			shake_component.trigger_x()

	elif player in area_left.get_overlapping_bodies():
		if not area_right.has_overlapping_bodies():
			move(Vector2.RIGHT)
		else:
			shake_component.trigger_y()

	elif player in area_right.get_overlapping_bodies():
		if not area_left.has_overlapping_bodies():
			move(Vector2.LEFT)
		else:
			shake_component.trigger_y()

func move(direction : Vector2):
	tween = create_tween().set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tween.tween_property($".", "global_position", global_position + direction * 32, 0.5)
