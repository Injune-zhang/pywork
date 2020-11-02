# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here
class human(models.Model):
    h_name = models.CharField(max_length=16)
    h_age = models.IntegerField(default=1)