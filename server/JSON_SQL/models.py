# In models.py

from django.db import models
from django.db.models import JSONField

class Diagram(models.Model):
    label = models.CharField(max_length=100)

class Node(models.Model):
    diagram = models.ForeignKey(Diagram, related_name='nodes', on_delete=models.CASCADE)
    node_id = models.CharField(max_length=100)
    node_type = models.CharField(max_length=100)
    position_x = models.IntegerField()
    position_y = models.IntegerField()
    data = JSONField()

class Edge(models.Model):
    diagram = models.ForeignKey(Diagram, related_name='edges', on_delete=models.CASCADE)
    edge_id = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    source_handle = models.CharField(max_length=100)
    target_handle = models.CharField(max_length=100)
    edge_type = models.CharField(max_length=100)
