from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User
from ..extensions import db

user_bp = Blueprint("user", __name__)

# READ all users (protected)
@user_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    data = [{"id": u.id, "username": u.username} for u in users]
    return jsonify(data), 200


# UPDATE own username (example)
@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)

    data = request.get_json()
    new_username = data.get("username")
    if not new_username:
        return jsonify({"message": "Username required"}), 400

    user.username = new_username
    db.session.commit()
    return jsonify({"message": "Username updated"}), 200


# DELETE own account
@user_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_me():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
