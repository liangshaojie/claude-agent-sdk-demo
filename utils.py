def calculate_average(numbers):
    if not numbers:
        return 0
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

# TODO: Add more utility functions here
def get_user_name(user):
    return user.get("name", "").upper()