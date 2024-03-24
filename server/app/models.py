from django.db import models

class Test(models.Model):
    name    = models.TextField()
    field1  = models.IntegerField()
    field2  = models.TextField()