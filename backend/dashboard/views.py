
from django.utils import timezone
from django.db.models import Count, Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tasks.models import Task


class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Get only the logged-in user's tasks.
        tasks = Task.objects.filter(
            user=request.user
        )

        # Current date and time.
        now = timezone.now()
        today = timezone.localdate()

        # Task status counts.
        total_tasks = tasks.count()

        pending_tasks = tasks.filter(
            status=Task.Status.PENDING
        ).count()

        in_progress_tasks = tasks.filter(
            status=Task.Status.IN_PROGRESS
        ).count()

        completed_tasks = tasks.filter(
            status=Task.Status.COMPLETED
        ).count()

        # Overdue tasks:
        # Due date has passed and task is not completed.
        overdue_tasks = tasks.filter(
            due_date__lt=now
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        # Tasks due today and not completed.
        due_today_tasks = tasks.filter(
            due_date__date=today
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        # Calculate completion percentage.
        if total_tasks > 0:
            completion_percentage = round(
                (completed_tasks / total_tasks) * 100,
                2
            )
        else:
            completion_percentage = 0

        # Priority summary.
        priority_summary = tasks.aggregate(
            low=Count(
                "id",
                filter=Q(priority=Task.Priority.LOW)
            ),
            medium=Count(
                "id",
                filter=Q(priority=Task.Priority.MEDIUM)
            ),
            high=Count(
                "id",
                filter=Q(priority=Task.Priority.HIGH)
            ),
        )

        # Dashboard response.
        data = {
            "total_tasks": total_tasks,

            "pending_tasks": pending_tasks,

            "in_progress_tasks": in_progress_tasks,

            "completed_tasks": completed_tasks,

            "overdue_tasks": overdue_tasks,

            "due_today_tasks": due_today_tasks,

            "completion_percentage": completion_percentage,

            "priority_summary": priority_summary,
        }

        return Response(data)
